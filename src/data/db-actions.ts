import { comparePassword } from "@/lib/password";
import { prisma } from "@/data/prisma";
import { User } from "@prisma/client";

export async function getUserFromDb(
  username: string,
  password: string
): Promise<User | null> {
  if (!username || !password) {
    throw new Error("Username and password hash are required");
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (!user) {
      console.log(
        `Invalid sign in attempt: User not found for username ${username}`
      );
      return Promise.resolve(null);
    }

    // Compare the password hash with the stored hash
    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      console.log(
        `Invalid sign in attempt: Password does not match for username ${username}`
      );
      return Promise.resolve(null);
    }

    return Promise.resolve(user);
  } catch (error) {
    console.error("Error fetching user from database:", error);
    return Promise.resolve(null);
  }
}
