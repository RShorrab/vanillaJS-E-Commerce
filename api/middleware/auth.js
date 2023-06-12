const jwt = require("jsonwebtoken");
const User = require("../models/User");

const config = process.env;

const verifyToken = async (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) 
  {
    return res.status(403).send("A token is required for authentication");
  }
  try 
  {
    const decoded = jwt.verify(token, 'anykey@1234');
    if(!decoded) //if the token was missed up, no user data in return..
    {
        res.status(400).json({message: "invalid token"})
    }
    else
    {
      const user = User.findOne({email: decoded.email});
      if(!user) 
      {
        res.status(404).json({message: "invalid user account"})
      }
      else
      {
        req.user = decoded;
        //return next();  //guess it's better here than below, to prevengt action if the token was invalid
      }
    }
  } 
  catch (err) 
  {
    return res.status(401).send("Invalid Token");
    //return res.status(401).json({message: "Invalid Token", error: err.message})
  }
  return next();
};

module.exports = verifyToken;