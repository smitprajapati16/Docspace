import { spawn } from "child_process";
import { chromium } from "playwright";

const viewports = [
  { name: "Small mobile", width: 320, height: 568 },
  { name: "Standard mobile", width: 375, height: 667 },
  { name: "Modern mobile", width: 390, height: 844 },
  { name: "Tablet", width: 768, height: 1024 },
  { name: "Laptop", width: 1366, height: 768 },
  { name: "Desktop", width: 1440, height: 900 },
  { name: "Large desktop", width: 1920, height: 1080 },
];

const TEST_PORT = 3456;
const BASE_URL = `http://localhost:${TEST_PORT}`;

async function waitForServer(url, timeoutMs = 25000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return true;
    } catch {
      await new Promise((r) => setTimeout(r, 300));
    }
  }
  throw new Error("Server did not become ready within timeout");
}

async function run() {
  console.log(`Starting Next.js production server for testing on port ${TEST_PORT}...\n`);
  const server = spawn(process.execPath, ["./node_modules/next/dist/bin/next", "start", "-p", String(TEST_PORT)], {
    stdio: "pipe",
    env: { ...process.env, PORT: String(TEST_PORT) },
  });

  server.stdout.on("data", (d) => process.stdout.write(d.toString()));
  server.stderr.on("data", (d) => process.stderr.write(d.toString()));

  try {
    await waitForServer(BASE_URL);
    console.log("\nNext.js server is ready. Launching headless Chromium...\n");

    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    let allPassed = true;

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(BASE_URL, { waitUntil: "networkidle" });

      const checks = await page.evaluate((vpHeight) => {
        const header = document.querySelector("header");
        const hero = document.querySelector("section");
        const heading = document.querySelector("h1");
        const ctaBtn = document.querySelector("a[href='/dashboard']");
        const docEl = document.documentElement;

        const headerRect = header ? header.getBoundingClientRect() : null;
        const heroRect = hero ? hero.getBoundingClientRect() : null;
        const headingRect = heading ? heading.getBoundingClientRect() : null;
        const ctaRect = ctaBtn ? ctaBtn.getBoundingClientRect() : null;

        const totalFirstScreenHeight = (headerRect ? headerRect.height : 0) + (heroRect ? heroRect.height : 0);
        const horizontalOverflow = docEl.scrollWidth > window.innerWidth;
        const heroFitsViewport = Math.round(totalFirstScreenHeight) <= vpHeight + 2;
        const headerVisible = headerRect && headerRect.top >= 0 && headerRect.bottom <= vpHeight;
        const headingVisible = headingRect && headingRect.top >= 0 && headingRect.bottom <= vpHeight;
        const ctaVisible = ctaRect && ctaRect.top >= 0 && ctaRect.bottom <= vpHeight;

        // Test sticky behavior by scrolling down 200px
        window.scrollTo(0, 200);
        const headerRectAfterScroll = header.getBoundingClientRect();
        const headerIsSticky = headerRectAfterScroll.top === 0;

        return {
          horizontalOverflow,
          heroFitsViewport,
          heroHeight: Math.round(totalFirstScreenHeight),
          headerVisible,
          headingVisible,
          ctaVisible,
          headerIsSticky,
        };
      }, vp.height);

      const passed =
        !checks.horizontalOverflow &&
        checks.heroFitsViewport &&
        checks.headerVisible &&
        checks.headingVisible &&
        checks.ctaVisible &&
        checks.headerIsSticky;

      if (!passed) allPassed = false;

      console.log(`[${passed ? "PASS" : "FAIL"}] ${vp.name.padEnd(16)} (${vp.width}x${vp.height}):`);
      console.log(`       - Hero fits 1-screen: ${checks.heroFitsViewport} (Total: ${checks.heroHeight}px, Viewport: ${vp.height}px)`);
      console.log(`       - Sticky header pinned on scroll: ${checks.headerIsSticky}`);
      console.log(`       - Horizontal overflow: ${checks.horizontalOverflow ? "YES" : "None"}`);
      console.log(`       - Header visible: ${checks.headerVisible}`);
      console.log(`       - Heading visible: ${checks.headingVisible}`);
      console.log(`       - Primary CTA visible: ${checks.ctaVisible}\n`);
    }

    await browser.close();

    if (allPassed) {
      console.log("SUCCESS: All 7 required viewport sizes passed sticky header & one-screen verification!");
    } else {
      console.error("FAILURE: Some viewport checks failed.");
      process.exitCode = 1;
    }
  } finally {
    server.kill();
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
