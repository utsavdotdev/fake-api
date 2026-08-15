import env from '../config/env.js';

function simulateDelay(req, res, next) {
  const raw = req.query._delay;
  const delay = Number.parseInt(raw, 10);

  if (!Number.isFinite(delay) || delay <= 0) {
    return next();
  }

  const clamped = Math.min(delay, env.maxDelayMs);

  setTimeout(next, clamped);
}

export default simulateDelay;
