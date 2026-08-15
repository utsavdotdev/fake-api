import env from '../config/env.js';

export function calculateDelay(raw, maxDelayMs) {
  const delay = Number.parseInt(raw, 10);

  if (!Number.isFinite(delay) || delay <= 0) {
    return 0;
  }

  return Math.min(delay, maxDelayMs);
}

function simulateDelay(req, res, next) {
  const clamped = calculateDelay(req.query._delay, env.maxDelayMs);

  if (clamped <= 0) {
    next();
    return;
  }

  setTimeout(next, clamped);
}

export default simulateDelay;
