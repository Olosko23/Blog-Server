import jwt from "jsonwebtoken";

const maxAge = 24 * 60 * 60; // 1 day in seconds

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: maxAge,
  });
};

export { createToken };
