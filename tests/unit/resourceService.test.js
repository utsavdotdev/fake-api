import * as resourceService from '../../src/services/resourceService.js';
import { NotFoundError } from '../../src/utils/errors.js';

describe('resourceService', () => {
  test('list throws NotFoundError for an unknown resource', () => {
    expect(() => resourceService.list('nope')).toThrow(NotFoundError);
  });

  test('getOne throws NotFoundError for an unknown resource', () => {
    expect(() => resourceService.getOne('nope', 1)).toThrow(NotFoundError);
  });

  test('create throws NotFoundError for an unknown resource', () => {
    expect(() => resourceService.create('nope', {})).toThrow(NotFoundError);
  });

  test('update throws NotFoundError for a missing id', () => {
    expect(() => resourceService.update('users', 9999, { name: 'x' })).toThrow(NotFoundError);
  });

  test('patch throws NotFoundError for a missing id', () => {
    expect(() => resourceService.patch('users', 9999, { name: 'x' })).toThrow(NotFoundError);
  });

  test('remove throws NotFoundError for a missing id', () => {
    expect(() => resourceService.remove('users', 9999)).toThrow(NotFoundError);
  });
});
