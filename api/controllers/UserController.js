const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const signup = async (req, res) => 
{
    try 
    {
      // console.log(req);
      const { first_name, last_name, email, password } = req.body;
      if (!(email && password && first_name && last_name)) 
      {
        return res.status(400).json({ error: "All input is required" });
      }
      const oldUser = await User.findOne({ email });
      if (oldUser) 
      {
        return res.status(409).json({ error: "User Already Exist. Please Login" });
      }
      encryptedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        first_name,
        last_name,
        email: email.toLowerCase(),
        password: encryptedPassword,
      });
      const token = jwt.sign(
        { user_id: user._id, email },
        'anykey@1234',
        {
          expiresIn: "2h",
        }
      );
      user.token = token;
      res.status(201).json(user);
    } 
    catch (err) 
    {
      console.log(err);
      return res.status(401).json({message: "Registeration Error", error: err.message})
    }
}

const signin = async (req, res) => 
{
    // Our login starts here
    try {
      // Get user input
      const { email, password } = req.body;
  
      // Validate user input
      if (!(email && password)) {
        res.status(400).json({ error: "All input is required" });
      }
      // Validate if user exist in our database
      const user = await User.findOne({ email });
  
      if (user && (await bcrypt.compare(password, user.password))) {
        // Create token
        const token = jwt.sign(
          { user_id: user._id, email },'anykey@1234',
          {
            expiresIn: "2h",
          }
        );
  
        // save user token
        user.token = token;
  
        // user
        res.status(200).json(user);
      }
      res.status(400).json({ error: "Invalid Credentials" });
    } catch (err) {
      console.log(err);
    }
    // Our register logic ends here
}

module.exports = 
{
    signup,
    signin
}