import { validationResult } from 'express-validator';

export class ValidationError extends Error {
  constructor(errors) {
    super('Validation failed');
    this.name = 'ValidationError';
    this.status = 422;
    this.errors = errors;
  }
}

export default function validate(rules) {
  return [
    ...rules,
    (req, res, next) => {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return next(new ValidationError(result.array()));
      }
      return next();
    },
  ];
}
