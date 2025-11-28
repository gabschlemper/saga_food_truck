export default function validate(schema) {
  return async function (req, res, next) {
    try {
      req.body = await schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      next();
    } catch (err) {
      return res.status(400).json({
        message: "Validation error",
        errors: err.errors,
      });
    }
  };
}
