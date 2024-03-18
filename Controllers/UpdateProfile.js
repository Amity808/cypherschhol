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


async function Updateprofile (req, res, next) {
    const {firstname, lastname, 
    othername, wallet_address} = req.body

    try {
        const patchData = req.body
      if (!patchData){
        throw createError.NotFound('No data was provided')
      }
      const user = await User.findOne({_id: req.userId});
      if (!user){
        throw createError.NotFound('User was not found')
      }

    //   Add fields validation
      Object.keys(patchData).forEach((field)=>{
        if(field != 'email')
          user[field] = patchData[field]
      })
      await user.save()
      res.send({status:true,message:"Profile updated successfully.."})
    } catch (error) {
        next(error)
    }
}


async function getProfile (req, res, next) {
    try {
      
        const user = await User.findOne({_id: req.userId});
        if (!user){
          throw createError.NotFound('User was not found')
        }
        res.send(await user.getProfile())
        
      } catch (error) {
        next(error)
      }
}



module.exports = getProfile