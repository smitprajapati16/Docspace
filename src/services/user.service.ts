import { prisma } from "@/lib/prisma";

export class UserService {
  static async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, createdAt: true },
    });
  }

  static async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: { id: true, name: true, email: true, createdAt: true },
    });
  }

  static async listAllUsersExcept(excludeUserId: string) {
    return prisma.user.findMany({
      where: {
        id: { not: excludeUserId },
      },
      select: { id: true, name: true, email: true },
      orderBy: { name: "asc" },
    });
  }
}
