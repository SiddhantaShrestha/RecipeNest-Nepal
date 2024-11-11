const validation = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    // console.log(req.body)
    // const { error } = schema.validate(req.body, { abortEarly: false }); //give all error simultaneously//but it is not good approach

    if (!error) {
      next();
    } else {
      const { details } = error;
      console.log(details);
      const message = details.map((value, i) => value.message).join(",");
      //   let err = new Error(message);
      //   err.statusCode = 422;
      //   throw err;
      res.status(422).json({
        success: false,
        message: message,
      });
    }
  };
};

export default validation;
