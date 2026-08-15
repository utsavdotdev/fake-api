import { jest } from '@jest/globals';

import errorHandler from '../../src/middlewares/errorHandler.js';
import { NotFoundError, ValidationError } from '../../src/utils/errors.js';

function mockResponse() {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
}

describe('errorHandler', () => {
  test('uses err.statusCode for the response status', () => {
    const res = mockResponse();
    errorHandler(new NotFoundError('users', 5), {}, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: true, status: 404, message: 'users with id 5 not found' }),
    );
  });

  test('falls back to err.status when statusCode is missing', () => {
    const res = mockResponse();
    const err = new Error('rate limited');
    err.status = 429;
    errorHandler(err, {}, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(429);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'rate limited' }));
  });

  test('masks server error messages and defaults to 500', () => {
    const res = mockResponse();
    const logSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    errorHandler(new Error('secret stack'), {}, res, jest.fn());
    logSpy.mockRestore();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ status: 500, message: 'Internal Server Error' }),
    );
  });

  test('includes validation details for ValidationError', () => {
    const res = mockResponse();
    const err = new ValidationError([{ path: 'email', msg: 'must be valid', value: 'x' }]);
    errorHandler(err, {}, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        details: [{ field: 'email', message: 'must be valid', value: 'x' }],
      }),
    );
  });
});
