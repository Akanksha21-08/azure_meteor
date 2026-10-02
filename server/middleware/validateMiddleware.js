const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!parsed.success) {
      const errorList = parsed.error.issues.map((err) => {
        const field = err.path.filter((p) => p !== 'body').join('.') || 'field';
        return `${field}: ${err.message}`;
      });

      return res.status(400).json({
        message: errorList[0] || 'Validation failed',
        errors: errorList,
      });
    }

    req.validatedData = parsed.data;
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Internal validation error: ' + error.message });
  }
};

module.exports = validate;
