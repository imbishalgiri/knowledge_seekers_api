import Joi from "joi";

const validationFields: any = {
  name: Joi.string().required().messages({
    "any.required": "Name is required",
    "string.empty": "Name cannot be empty",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Valid email is not supplied",
    "any.required": "Email is required",
    "string.empty": "Email cannot be empty",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required",
    "string.empty": "Password cannot be empty",
  }),
};

export default validationFields;
