import jwt from "jsonwebtoken";

const JWT = {
  validate: (token) => {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return false;
    }
  },
  create: (data) => {

    return jwt.sign(data, process.env.JWT_SECRET);
  },
};

export default JWT;
