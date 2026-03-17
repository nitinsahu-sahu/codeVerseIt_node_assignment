const User = require("../models/User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
     try {
        const { name, email, password, role} = req.body;
        const hash = await bcrypt.hash(password, 10)

        const newUser = new User({
          name,
          email,
          role,
          password:hash
        });
    
        await newUser.save();
    
        res.status(201).json({
          message: "User added successfully",
          data: newUser,
          success:true
        });
      } catch (error) {
        res.status(500).json({
          success:false,
          message: "Error adding user",
          error: error.message,
        });
      }
}

exports.login = async (req, res) => {
     try {
        const { password, email } = req.body;
    
        const user = await User.findOne({email});
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            res.status(400).json({
                message: "Invalid",
                success:true,
            });
        }
        const token = jwt.sign({"id":user._id,"role":user.role},process.env.ACCESS_TOKEN_SECRET)
        res.status(201).json({
          message: "User login successfully",
          token,
          success:true,
        });
      } catch (error) {
        res.status(500).json({
          message: "Error adding user",
          error: error.message,
          success:false,
        });
      }
}