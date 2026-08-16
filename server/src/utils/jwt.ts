import "dotenv/config";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

const jwtSecret: string = JWT_SECRET;

export function createAccessToken(userId: string, role: "user" | "admin") {
  return jwt.sign(
    {
      sub: userId,
      role,
    },
    jwtSecret,
    {
      expiresIn: "1h",
    },
  );
}
