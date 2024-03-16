const connectors = require('../helpers/web3Connector.js')


const CreateCourseEvent = connectors.contract.events.CreateCourse()
const CourseEnrolledEvent = connectors.contract.events.CourseEnrolled()
const CourseCompletedEvent = connectors.contract.events.CourseCompleted()
const AssignmentSubmittedEvent = connectors.contract.events.AssignmentSubmitted()



CreateCourseEvent.on('data', async (eventData) => {
    try {
        console.log("CreateCourseEvent evnt recieved", eventData.returnValues);
        const result = eventData.returnValues
        console.log(result)
    } catch (error) {
        console.log("CreateCourseEvent ERROR ", err)
        
    }
})


CourseEnrolledEvent.on('data', async (eventData) => {
    try {
        console.log("CourseEnrolledEvent evnt recieved", eventData.returnValues);
        const result = eventData.returnValues
        console.log(result)
    } catch (error) {
        console.log("CourseEnrolledEvent ERROR ", err)
        
    }
})



CourseCompletedEvent.on('data', async (eventData) => {
    try {
        console.log("CourseCompletedEvent evnt recieved", eventData.returnValues);
        const result = eventData.returnValues
        console.log(result)
    } catch (error) {
        console.log("CourseCompletedEvent ERROR ", err)
        
    }
})


AssignmentSubmittedEvent.on('data', async (eventData) => {
    try {
        console.log("AssignmentSubmittedEvent evnt recieved", eventData.returnValues);
        const result = eventData.returnValues
        console.log(result)
    } catch (error) {
        console.log("AssignmentSubmittedEvent ERROR ", err)
        
    }
})

connectors.web3.provider.on('connect',()=>{
    console.log("CONNECTED TO CONTRACT EVENTS")
})

connectors.web3.provider.on('disconnect',()=>{
    console.log("Websocker provider disconnected")
})
