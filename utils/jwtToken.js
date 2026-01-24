const jwt = require("jsonwebtoken");

module.exports.generateToken = (userData) => {
  // const payLoad = {
    
  //   ...userData
  //  };

  const payLoad = {
    id: userData.id,
    email: userData.email,
     role: userData.role,
  };
  return jwt.sign(payLoad, process.env.JWT_SECRETE_KEY, { expiresIn: "10h" });
};

module.exports.verifyJWTToken = async (token) => {
  return jwt.verify(token, `${process.env.JWT_SECRETE_KEY}`, (err, decoded) => {
    return { err: err, decoded: decoded };
  });
};
