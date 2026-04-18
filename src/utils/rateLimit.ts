// Simple in-memory rate limiter for Phase 1
// Note: In a real production environment, use Redis (e.g., @upstash/ratelimit) 
// to ensure persistence across serverless function invocations.

const rateLimitMap = new Map<string, { count: number, resetTime: number }>();

export function checkRateLimit(identifier: string, limit: number, windowMs: number) {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { success: false, remaining: 0 };
  }

  entry.count++;
  return { success: true, remaining: limit - entry.count };
}
