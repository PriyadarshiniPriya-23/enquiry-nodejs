// src/validators/authValidator.js
const Joi = require('joi');

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
}).unknown(true);

const registerSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('counsellor','accounts','hr','admin','consumer').required()
});

module.exports = { loginSchema, registerSchema };
