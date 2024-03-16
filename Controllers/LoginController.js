const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
const validator = require("validator")
const UserModel = require("../models/UserModel")
const dbConnect = require("../utils/dbconnect")
const bcrypt = require('bcrypt')


dotenv.config()

async function LoginUser(req, res) {

    dbConnect()
    const { email, password } = req.body

    if(!email) {
        return res.status(400).json({message: "email not found"})
    }

    if(!validator.isEmail(email)) {
        return res.status(400).json({message: "email is not valid"})
    }

    if(!validator.isStrongPassword(password)) {
        return res.status(400).json({message: 'password is weak or invalid password'})
    }
    const lowerCaseEmail = email.toLowerCase()
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await UserModel.findOne({ email: lowerCaseEmail })
    const isMatch = await bcrypt.compare(password, user.password);

    if (!user || !isMatch) {
        return res.status(401).json({ message: "Invalid credentials"})
      }

      const accessToken = jwt.sign({ _id: user._id, email: user.email, address: user.address}, process.env.ACCESS_TOKEN_SECRET)
      console.log(accessToken);
      if(user) {

         return  res.json({ accessToken: accessToken, message: "Successful Login"})
      } 

}

module.exports = LoginUser