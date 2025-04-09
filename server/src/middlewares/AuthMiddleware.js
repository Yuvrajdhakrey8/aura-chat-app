import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies?.token;
    const { TokenExpiredError } = jwt;

    if (!token) {
      return res
        .status(401)
        .send({ success: false, msg: "Unauthorized, token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY);

    req.user = decoded;

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).send({ msg: "Token has expired" });
    }
    return res.status(403).send({ success: false, msg: "Invalid token" });
  }
};
