import { type } from 'express/lib/response'
import mongoose from 'mongoose'


const EducationSchema = new mongoose.Schema ({
    courseId : { type: Number, required: false, default: "" },
    courseTitle: { type: String, required: false, default: "" },
    courseCredit: { type: Number, required: false, default:0 },
    courseReward: { type: Number, required: false, default:0 },
    submitCourseAss: { type: String, default: "", required: false },
    wallet: { type: String, default: "", required: false },
    student: { type: Schema.Types.ObjectId,  ref: 'user', required: false},
    studentWallet: { type: String, required: false, default: "",}
})


EducationSchema.post('save', async function (doc) {
    try {
        const newRecord = doc.toObject();
        const payload = newRecord
        delete payload.password
        delete payload._id
    } catch (error) {
        console.log('Error sending WebSocket message:', error)
    }
})


const Education = mongoose.model('education', EducationSchema)
export default Education