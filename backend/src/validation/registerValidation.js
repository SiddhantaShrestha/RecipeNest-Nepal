import Joi from "joi";
let registerValidation = Joi.object()
  .keys({
    name: Joi.string().required().min(3).max(22).message({
      "any.required": "name is required",
      "string.base": "field must be string",
      "string.min": "name must be at least 3 characters",
      "string.max": "name must be at under 15 characters",
    }),
    username: Joi.string().required().min(3).max(22).message({
      "any.required": "username is required",
      "string.base": "field must be string",
      "string.min": "name must be at least 3 characters",
      "string.max": "name must be at under 15 characters",
    }),
    // age: Joi.number()
    //   .required() //.min(18).max(60),
    //   .custom((value, msg) => {
    //     //validation pass
    //     if (value >= 18) {
    //       return true;
    //     } else {
    //       return msg.message("Age must be at least 18");
    //     }
    //   })
    //   .message({
    //     "any.required": "age is required",
    //     "number.base": "field must be number",
    //     "number.min": "age must be at least 18",
    //     "number.max": "age must be under 60",
    //   }),
    contact: Joi.string()
      .required()
      .custom((value, msg) => {
        // Regex for Nepali contact numbers (10 digits starting with 9)
        const validContact = value.match(/^9\d{9}$/);
        if (validContact) {
          return true;
        } else {
          return msg.message(
            "contact number must be a valid Nepali number (starting with 9 and exactly 10 digits)"
          );
        }
      })
      .message({
        "any.required": "contact is required",
        "string.base": "contact must be a string",
      }),
    email: Joi.string()
      .required()
      .custom((value, msg) => {
        let validEmail = value.match(
          /\b[A-Za-z0-9,_%+-]+@[A-Za-z0-9,-]+\.[A-Z|a-z]{2,7}\b/
        );
        if (validEmail) {
          return true;
        } else {
          return msg.message("email is not in valid format");
        }
      }),

    dob: Joi.date().required(),

    password: Joi.string()
      .required()
      .custom((value, msg) => {
        let validPassword = value.match(
          /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/
        );
        if (validPassword) {
          return true;
        } else {
          return msg.message(
            "password must have at least 1 uppercase, 1 lowercase, 1 special character"
          );
        }
      }),

    // .custom((value, msg) => {
    //   let validNumber = value.match(/(?:\+977|0)\d{9}/);
    //   if (validNumber) {
    //     return true;
    //   } else {
    //     return msg.message("phoneNumber is not valid");
    //   }
    // }),
  })
  .unknown(true);

export default registerValidation;
