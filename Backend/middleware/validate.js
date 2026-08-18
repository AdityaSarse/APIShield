const validate = (schema) => {
  return (req, res, next) => {
    try {
      req.validatedData = schema.parse(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default validate;
