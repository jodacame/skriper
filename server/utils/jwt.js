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

    return jwt.sign(data, process.env.JWT_SECRET, {
      expiresIn: 60 * 60 * 24 * 365, // 1 year
    });
  },
};

export default JWT;
