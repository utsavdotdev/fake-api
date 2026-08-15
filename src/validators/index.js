import { body } from 'express-validator';

function requiredString(field) {
  return body(field)
    .trim()
    .notEmpty()
    .withMessage(`${field} is required`)
    .isString()
    .withMessage(`${field} must be a string`);
}

function optionalString(field) {
  return body(field).optional().trim().isString().withMessage(`${field} must be a string`);
}

function requiredInt(field) {
  return body(field).toInt().isInt().withMessage(`${field} is required and must be an integer`);
}

function optionalInt(field) {
  return body(field).optional().toInt().isInt().withMessage(`${field} must be an integer`);
}

function requiredEmail() {
  return body('email')
    .trim()
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('email must be a valid email address');
}

function optionalEmail() {
  return body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('email must be a valid email address');
}

const userRules = {
  create: [requiredString('name'), requiredEmail()],
  update: [requiredString('name'), requiredEmail()],
  patch: [optionalString('name'), optionalEmail()],
};

const postRules = {
  create: [requiredString('title'), requiredString('body'), requiredInt('userId')],
  update: [requiredString('title'), requiredString('body'), requiredInt('userId')],
  patch: [optionalString('title'), optionalString('body'), optionalInt('userId')],
};

const commentRules = {
  create: [requiredInt('postId'), requiredString('body')],
  update: [requiredInt('postId'), requiredString('body')],
  patch: [optionalInt('postId'), optionalString('body')],
};

const rules = {
  users: userRules,
  posts: postRules,
  comments: commentRules,
};

export default rules;
