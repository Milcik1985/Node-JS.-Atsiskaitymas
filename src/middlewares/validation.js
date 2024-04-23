const validData = (schema) => {
  return (req, res, next) => {
    console.log("1111", req.body);
    const { error } = schema.validate(req.body);

    if (error) {
      console.log("2222", error);
      res.status(400).json({ message: "Wrong data" });
    } else {
      next();
    }
  };
};

export default validData;
