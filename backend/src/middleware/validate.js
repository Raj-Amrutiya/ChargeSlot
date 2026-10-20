const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse(req.body);
    req.body = parsed;
    next();
  } catch (error) {
    const formattedErrors = error.errors
      ? error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }))
      : [{ message: error.message }];

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: formattedErrors,
    });
  }
};

module.exports = validate;
