import { SignJWT, jwtVerify, decodeJwt } from "jose";

const JWT_SECRET_STRING = process.env.JWT_SECRET || "CIVICSYNC_AI_SUPER_SECURE_JWT_SECRET_2026";
const secret = new TextEncoder().encode(JWT_SECRET_STRING);

export interface JWTPayload {
  userId: string;
  phone: string;
  role: "CITIZEN" | "ADMIN";
  iat?: number;
  exp?: number;
}

export async function signToken(payload: Omit<JWTPayload, "iat" | "exp">): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(secret);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

export function decodeToken(token: string): JWTPayload | null {
  try {
    return decodeJwt(token) as unknown as JWTPayload;
  } catch {
    return null;
  }
}
