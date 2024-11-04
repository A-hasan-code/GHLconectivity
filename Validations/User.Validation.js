const Joi = require('joi');

// User Create Schema
const userCreateSchema = Joi.object({
    first_name: Joi.string(),
    last_name: Joi.string(),
    username: Joi.string().min(3).max(30).required().messages({
        'string.base': 'Username must be a string.',
        'string.empty': 'Username cannot be empty.',
        'string.min': 'Username must be at least 3 characters long.',
        'string.max': 'Username must be less than or equal to 30 characters long.',
        'any.required': 'Username is required.'
    }),
    email: Joi.string().email().required().messages({
        'string.base': 'Email must be a string.',
        'string.empty': 'Email cannot be empty.',
        'string.email': 'Email must be a valid email address.',
        'any.required': 'Email is required.'
    }),
    password: Joi.string().min(6).required().messages({
        'string.base': 'Password must be a string.',
        'string.empty': 'Password cannot be empty.',
        'string.min': 'Password must be at least 6 characters long.',
        'any.required': 'Password is required.'
    }),
    phone_number: Joi.string().optional().allow(''),

});

module.exports = { userCreateSchema }