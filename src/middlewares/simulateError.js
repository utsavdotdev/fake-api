function simulateError(req, res, next) {
  const raw = req.query._status;

  if (raw === undefined) {
    return next();
  }

  const status = Number.parseInt(raw, 10);

  if (!Number.isFinite(status) || status < 400 || status > 599) {
    return next();
  }

  return res.status(status).json({
    error: true,
    status,
    message: `Simulated ${status} error`,
  });
}

export default simulateError;
