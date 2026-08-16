import bcrypt from "bcrypt";
import { userRepository } from "../repositories/user.repository.js";
import { createAccessToken } from "../utils/jwt.js";

const SALT_ROUNDS = 12;

export const authService = {
  async hashPassword(password: string) {
    return bcrypt.hash(password, SALT_ROUNDS);
  },

  async comparePassword(password: string, passwordHash: string) {
    return bcrypt.compare(password, passwordHash);
  },

  async register(data: { name: string; email: string; password: string }) {
    const existingUser = await userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new Error("Email already registered");
    }

    const passwordHash = await this.hashPassword(data.password);

    const user = await userRepository.create({
      name: data.name,
      email: data.email,
      passwordHash,
    });

    return user;
  },

  async login(data: { email: string; password: string }) {
    const user = await userRepository.findByEmail(data.email);

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const passwordMatches = await this.comparePassword(
      data.password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      throw new Error("Invalid credentials");
    }

    const accessToken = createAccessToken(user.id, user.role);

    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  },
};
