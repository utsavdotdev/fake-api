import env from '../config/env.js';
import { ValidationError } from '../utils/errors.js';

function resolveStatus(err) {
  if (Number.isInteger(err.statusCode)) return err.statusCode;
  if (Number.isInteger(err.status)) return err.status;
  return 500;
}

function validationDetails(err) {
  return err.errors.map(({ path, msg, value }) => ({ field: path, message: msg, value }));
}

export default function errorHandler(err, req, res, next) {
  const status = resolveStatus(err);
  const isClientError = status >= 400 && status < 500;

  const response = {
    error: true,
    status,
    message: isClientError ? err.message : 'Internal Server Error',
  };

  if (err instanceof ValidationError) {
    response.details = validationDetails(err);
  }

  if (env.nodeEnv !== 'production' && status >= 500) {
    console.error(err.stack || err);
  }

  return res.status(status).json(response);
}
