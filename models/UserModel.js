const mongoose = require("mongoose");
const bcrypt = require('bcrypt')


const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  password: { type: String, required: true },
  email_confirmed: { type: Boolean, required: true },
  firstname: { type: String, default: "", required: false },
  lastname: { type: String, default: "", required: false },
  othername: { type: String, default: "", required: false },
  username: { type: String, default: "", required: false },
  wallet_address: {
    type: String,
    required: false,
    default: "",
  },
  usertype: {
    type: String,
    required: false,
    default: "SUDENT",
  },
  courseRewards: { type: Number, required: false, default: "" },
  enrollCourse: { type: Number, required: false, default: "" },
  rewardWithdraw: { type: Number, required: false, default: "" },
  
});


userSchema.pre('save', async function (next) {
  try {
    if (this.isNew){
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(this.password, salt)
      this.password = hashedPassword,
      this.username = 'User '+this._id
    }
    next()
  } catch (error) {
    next(error)
  }
})


userSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password)
  } catch (error) {
    throw error
  }
}


userSchema.methods.getProfile = async function () {
    try {
        return {
          firstname: this.firstname,
          surname: this.surname,
          othername: this.othername,
          email: this.email,
          username:this.username,
          usertype: this.usertype
        }
    } catch (error) {
        throw error
    }
}

const User = mongoose.model('user', userSchema)

module.exports = User