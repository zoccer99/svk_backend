const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const cookie = req.headers["cookie"];
  const authToken = cookie && cookie.split("authorization=")[1];
  console.log(authToken)
  if (authToken == null) return res.sendStatus(401);
  jwt.verify(authToken, process.env.TOKEN_SECRET, (err, decoded) => {
    console.log(decoded);
    if (err) return res.sendStatus(403);
    req.user = decoded;
    next();
  });
};
