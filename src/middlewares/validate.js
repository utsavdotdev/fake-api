import { validationResult } from 'express-validator';

import { ValidationError } from '../utils/errors.js';

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
