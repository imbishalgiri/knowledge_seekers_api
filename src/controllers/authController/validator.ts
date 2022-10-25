import { Request } from "express";
import Joi from "joi";

import validationFields from "./validatorRules";

/*
  @params:
   1 -> fields<array>
  @returns
   1 -> validation object based upon that array

  DESC --> utility function for request body validation
  Feel free to add validation fields as per your requirement
  ValidationFields Objects with keys => field and value => rules related to that key
*/
const getValidationObject = (fields: string[]) => {
  const validationObject: any = {};
  const keys = Object.keys(validationFields);
  for (let i = 0; i < keys.length; i++) {
    if (fields.includes(keys[i])) {
      validationObject[keys[i]] = validationFields[keys[i]];
    }
  }
  return validationObject;
};

// -------------------- utility function area end

// signup validation
const verifySignup = (body: Request): any => {
  let customError = null;
  const Schema = Joi.object(getValidationObject(["name", "email", "password"]));
  const { error, value } = Schema.validate(body, {
    abortEarly: false,
  });

  if (error) {
    customError = error?.details?.map((oldError) => {
      return { field: oldError.path[0], errorMessage: oldError.message };
    });
  }
  return { error: customError, value };
};

// Login Validation
const verifyLogin = (body: Request): any => {
  let customError = null;
  const Schema = Joi.object(getValidationObject(["email", "password"]));
  const { error, value } = Schema.validate(body, {
    abortEarly: false,
  });

  if (error) {
    customError = error?.details?.map((oldError) => {
      return { field: oldError.path[0], errorMessage: oldError.message };
    });
  }
  return { error: customError, value };
};

export { verifySignup, verifyLogin };
