const connectors = require('./web3Connector')
const socketMessengers = require('./wssender')
const Education = require('../models/Student')
const User = require('../models/UserModel')
const ejs =  require('ejs')

const handlers = {

courseCreated: async (courseId, title,  courseURL, credits, reward, wallet) => {
    console.log("creating course webhook fired ", courseId, courseURL, title, credits, reward)
    const educationSave = Education.findOne({ courseId: courseId })
    if (!educationSave) {
        educationSave.courseId = courseId
        educationSave.courseTitle = title
        educationSave.courseCredit = credits
        educationSave.courseReward = reward
        educationSave.wallet =  wallet

        await educationSave.save()
    } else {
        console.log("course already exists")
    }
    
    }
}