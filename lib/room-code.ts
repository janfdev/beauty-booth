/**
 * Room Code Generator & TTL 5 Jam Validator
 * Room code terdiri dari 6 karakter alfanumerik yang mudah diketik pasangan (contoh: LOVE88, SYNC24)
 */

export const ROOM_TTL_HOURS = 5;

export function generateRoomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `LOVE-${code}`;
}

export function calculateExpirationDate(): Date {
  const expires = new Date();
  expires.setHours(expires.getHours() + ROOM_TTL_HOURS);
  return expires;
}

export function isRoomExpired(expiresAt: Date | string): boolean {
  return new Date(expiresAt).getTime() <= Date.now();
}
