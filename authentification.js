const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers["x-access-token"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = decoded;
    next();
  });
};

// const cookie = req.headers["cookie"];
// const authToken = cookie && cookie.split("authorization=")[1];
// if (authToken == null) return res.sendStatus(401);
// jwt.verify(authToken, process.env.TOKEN_SECRET, (err, decoded) => {
//   if (err) return res.sendStatus(403);
//   req.user = decoded;
//   next();
// });
