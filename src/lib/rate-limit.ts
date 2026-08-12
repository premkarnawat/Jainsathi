// ========================================================
// JAINSAATHI RATE LIMITER & SECURITY ENGINE
// ========================================================

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const memoryStore = new Map<string, RateLimitRecord>();

/**
 * In-memory sliding window rate limiter for API routes
 * Prevents OTP spam, brute-force login attempts, and search scrapers.
 */
export function checkRateLimit(
  identifier: string,
  limit: number = 5,
  windowSeconds: number = 60
): { allowed: boolean; remaining: number; resetInSeconds: number } {
  const now = Date.now();
  const key = `ratelimit:${identifier}`;
  const record = memoryStore.get(key);

  if (!record || now > record.resetAt) {
    const newRecord: RateLimitRecord = {
      count: 1,
      resetAt: now + windowSeconds * 1000,
    };
    memoryStore.set(key, newRecord);
    return {
      allowed: true,
      remaining: limit - 1,
      resetInSeconds: windowSeconds,
    };
  }

  if (record.count >= limit) {
    const resetInSeconds = Math.ceil((record.resetAt - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      resetInSeconds,
    };
  }

  record.count += 1;
  memoryStore.set(key, record);

  return {
    allowed: true,
    remaining: limit - record.count,
    resetInSeconds: Math.ceil((record.resetAt - now) / 1000),
  };
}
