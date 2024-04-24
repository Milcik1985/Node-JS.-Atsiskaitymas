const validData = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);

    if (error) {
      res.status(400).json({ message: "Wrong data" });
    } else {
      next();
    }
  };
};

export default validData;
