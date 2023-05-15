const Joi = require("joi");

const createUserValidation = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format",
    "any.required": "Email is required",
  }),
  password: Joi.string()
    .min(8)
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&.]{8,}$/
    )
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters long",
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character",
      "any.required": "Password is required",
    }),
    role: Joi.string()
    .valid("admin", "operator", "FO")
    .required()
    .messages({
      'any.only': 'Invalid role. Allowed roles are \'admin\' and \'operator\'',
      'any.required': 'Role is required',
    }),
});

const loginValidation = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format",
    "any.required": "Email is required",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required",
  }),
});

const registerOperatorSchema = Joi.object({
  firstName: Joi.string().pattern(/^[A-Za-z]+$/).required().messages({
    "string.pattern.base": "First name must contain only letters",
    "any.required": "First name is required",
  }),
  lastName: Joi.string().pattern(/^[A-Za-z]+$/).required().messages({
    "string.pattern.base": "Last name must contain only letters",
    "any.required": "Last name is required",
  }),
  phoneNumber: Joi.string().length(11).pattern(/^\d+$/).required().messages({
    "string.length": "Phone number must be 11 digits long",
    "string.pattern.base": "Phone number must contain only digits",
    "any.required": "Phone number is required",
  }),
  nationality: Joi.string()
  .valid('Nigerian')
  .required()
  .messages({
    'any.only': 'Invalid nationality. Only \'Nigerian\' is allowed',
    'any.required': 'Nationality is required',
  }),
  state: Joi.string().required().messages({
    "any.required": "State is required",
  }),
  lga: Joi.string().required().messages({
    "any.required": "LGA is required",
  }),
  sex: Joi.string().valid("male", "female").required().messages({
    "any.only": 'Invalid sex. Allowed values are \'male\' and \'female\'',
    "any.required": "Sex is required",
  }),
  dob: Joi.date()
    .format('iso')
    .min("1930-01-01") // Adjust the minimum date as needed
    .max("now") // Allow dates up to the current date
    .required()
    .messages({
      "date.format": "Date of birth must be in the format YYYY-MM-DD",
      "date.base": "Invalid date of birth",
      "date.min": "Date of birth must be after 1930-01-01",
      "date.max": "Date of birth cannot be in the future",
      "any.required": "Date of birth is required",
    }),
  nin: Joi.string().length(11).pattern(/^\d+$/).required().messages({
    "string.length": "NIN must be 11 digits long",
    "string.pattern.base": "NIN must contain only digits",
    "any.required": "NIN is required",
  }),
});

const registerFOSchema = Joi.object({
  firstName: Joi.string().pattern(/^[A-Za-z]+$/).required().messages({
    "string.pattern.base": "First name must contain only letters",
    "any.required": "First name is required",
  }),
  lastName: Joi.string().pattern(/^[A-Za-z]+$/).required().messages({
    "string.pattern.base": "Last name must contain only letters",
    "any.required": "Last name is required",
  }),
  phoneNumber: Joi.string().length(11).pattern(/^\d+$/).required().messages({
    "string.length": "Phone number must be 11 digits long",
    "string.pattern.base": "Phone number must contain only digits",
    "any.required": "Phone number is required",
  }),
  sex: Joi.string().valid("male", "female").required().messages({
    "any.only": 'Invalid sex. Allowed values are \'male\' and \'female\'',
    "any.required": "Sex is required",
  }),
  dob: Joi.date()
    .format('iso')
    .min("1930-01-01") // Adjust the minimum date as needed
    .max("now") // Allow dates up to the current date
    .required()
    .messages({
      "date.format": "Date of birth must be in the format YYYY-MM-DD",
      "date.base": "Invalid date of birth",
      "date.min": "Date of birth must be after 1930-01-01",
      "date.max": "Date of birth cannot be in the future",
      "any.required": "Date of birth is required",
    }),
  bvn: Joi.string().length(11).pattern(/^\d+$/).required().messages({
    "string.length": "BVN must be 11 digits long",
    "string.pattern.base": "BVN must contain only digits",
    "any.required": "BVN is required",
  }),
  nin: Joi.string().length(11).pattern(/^\d+$/).required().messages({
    "string.length": "NIN must be 11 digits long",
    "string.pattern.base": "NIN must contain only digits",
    "any.required": "NIN is required",
  }),
  state: Joi.string().required().messages({
    "any.required": "State is required",
  }),
  lga: Joi.string().required().messages({
    "any.required": "LGA is required",
  }),
  hub: Joi.string().required().messages({
    "any.required": "LGA is required",
  }),
  GovID: Joi.string().length(11).pattern(/^\d+$/).required().messages({
    "string.length": "GovID must be 11 digits long",
    "string.pattern.base": "GovID must contain only digits",
    "any.required": "GovID is required",
  }),
  GovIDtype: Joi.string().pattern(/^[A-Za-z]+$/).required().messages({
    "any.required": "Government ID type is required",
    "string.pattern.base": "Last name must contain only letters",
  }),
});

const selectProductSchema = Joi.object({
  product: Joi.string().required().messages({
    "any.required": "Product is required",
  }),
  seedType: Joi.string().required().messages({
    "any.required": "Seed type is required",
  }),
});

module.exports = {
  createUserValidation,
  loginValidation,
  registerOperatorSchema,
  registerFOSchema,
  selectProductSchema,
};
