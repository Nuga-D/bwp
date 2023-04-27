const Joi = require("joi");
const states = require("../dao/states");
const seeds = require("../dao/seeds");

const createUserValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&.]{8,}$/
    )
    .required(),
  role: Joi.string().valid("admin", "operator").required(),
});

const loginValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const registerOperatorSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  phoneNumber: Joi.string().length(11).pattern(/^\d+$/).required(),
  nationality: Joi.string().valid("Nigerian").required(),
  state: Joi.string()
    .valid(...Object.keys(states))
    .required(),
  lga: Joi.string()
    .valid(...[].concat(...Object.values(states)))
    .required(),
  sex: Joi.string().valid("male", "female").required(),
  dob: Joi.date().required(),
  nin: Joi.string().length(11).pattern(/^\d+$/).required(),
});

const selectProductSchema = Joi.object({
    product: Joi.string()
    .valid(...Object.keys(seeds))
    .required(),
    seedType: Joi.string()
    .valid(...[].concat(...Object.values(seeds)))
    .required(),
})

module.exports = {
  createUserValidation,
  loginValidation,
  registerOperatorSchema,
  selectProductSchema
};
