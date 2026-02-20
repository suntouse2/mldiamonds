import "server-only";

import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;

export function buildOrderKey(orderId: number) {
  if (!JWT_SECRET) throw Error("Missing JWT_SECRET");
  return jwt.sign({ orderId }, JWT_SECRET, { expiresIn: "14d" });
}

export function verifyOrderKey(key: string) {
  if (!JWT_SECRET) throw Error("Missing JWT_SECRET");
  return jwt.verify(key, JWT_SECRET);
}
