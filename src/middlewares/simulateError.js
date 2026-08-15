export function parseStatus(raw) {
  if (raw === undefined) {
    return null;
  }

  const status = Number.parseInt(raw, 10);

  if (!Number.isFinite(status) || status < 400 || status > 599) {
    return null;
  }

  return status;
}

function simulateError(req, res, next) {
  const status = parseStatus(req.query._status);

  if (status === null) {
    return next();
  }

  return res.status(status).json({
    error: true,
    status,
    message: `Simulated ${status} error`,
  });
}

export default simulateError;
