import { prisma } from "@/data/prisma";
import BaseRepository from "./BaseRepository";
import { User } from "@prisma/client";

export default class UserRepository extends BaseRepository<User> {
  constructor() {
    super(prisma.user);
  }

  getByUserName(username: string): Promise<User> {
    return this.modelClient.findUnique({
      where: {
        username,
      },
    });
  }

  getByEmail(email: string): Promise<User> {
    return this.modelClient.findUnique({
      where: {
        email,
      },
    });
  }
}
