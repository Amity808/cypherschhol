const User = require('../models/UserModel.js')
const JWT = require('jsonwebtoken')
const messages = require("../helpers/messages.js")
const validations = require("../helpers/validator.js")
const bcrypt = require("bcrypt")
const mongoose = require("mongoose")
const client = require("../utils/redis_connect.js")
const utils = require("../utils/utilsfn.js")
const createError = require('http-errors')
const validator = require('validator')
const dbConnect = require('../utils/dbconnect.js')


// const session =  mongoose.startSession();

async function Register (req, res) {

    dbConnect()
    const { email, password, address } = req.body 

    if(!email) {
        return res.status(400).json({message: "email not found"})
    }
    if(!password) {
        return res.status(400).json({message: "password not found"})
    }
    if(!address) {
        return res.status(400).json({message: "address not found"})
    }

    if(!validator.isEmail(email)) {
        return res.status(400).json({message: 'email is not valid'})
    }

    if(!validator.isStrongPassword(password)) {
        return res.status(400).json({message: 'password is not strong'})
    }

    const lowerCaseEmail = email.toLowerCase()
    const lowerCaseAddress = address.toLowerCase()

    const user = await User.findOne({ email: lowerCaseEmail });
    if (user) {
        return res.status(401).json({message: "email or address already exists"})   
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await new User({
        email: lowerCaseEmail,
        password: hashedPassword,
        address:lowerCaseAddress,
        email_confirmed: true
    })
    await newUser.save()

    return res.json({message: "registration completed", newUser: newUser})


}

module.exports = Register