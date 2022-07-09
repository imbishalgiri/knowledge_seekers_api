import { Error } from "mongoose";

export const validateError = (err: Error) => {
  // this will be the final return of formatted error
  const validatedError = {};

  // if the error has name validation error
  if (err.name.toLocaleLowerCase() === "validationerror") {
    const errMessage = err.message;
    // breaking error message by comma ( needs further breakdown )
    let arrayByComma = errMessage.split(",");
    // This will hold the second final array (splitted by comma ',' and colon ':' )
    let errorToken = [];
    arrayByComma.forEach((arrElement: string) => {
      let arrByColon = arrElement.split(": ");
      errorToken = errorToken.concat(arrByColon);
    });
    // this is a final array after removing the first element
    errorToken = errorToken.slice(1);
    // generating dynamic error object, mutuating the object
    errorToken.forEach((error: string, index) => {
      if ((index + 1) % 2 !== 0) {
        if (!validatedError[error]) {
          validatedError[error.trim()] = errorToken[index + 1]
            .trim()
            .split(".")[0];
        }
      }
    });

    const formattedErrorMessage = {
      status: "Error",
      message: err.name,
      data: validatedError,
    };

    return formattedErrorMessage;
  } else {
    return err;
  }

  // add other cases down below
};
