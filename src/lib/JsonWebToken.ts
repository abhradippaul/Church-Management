import { sign, verify } from "jsonwebtoken";

interface PayloadValue {
  _id: string;
  role: "admin" | "owner";
}

export function createToken(payload: PayloadValue) {
  return {
    access_token: sign(payload, "123", { expiresIn: "1d" }),
    refresh_token: sign(payload, "123", { expiresIn: "30d" }),
  };
}

export function verifyToken(token: string): PayloadValue {
  return verify(token, "123") as PayloadValue;
}
