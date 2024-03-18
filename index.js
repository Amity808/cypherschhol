const express = require('express');
const http = require('http');
const cors = require('cors')
const config = require('dotenv')
config.config()
const logger = require('morgan')
// import {Register} from "./Controllers/AuthController.js"
const Registration = require("./Controllers/AuthController")
const getProfile = require("./Controllers/UpdateProfile")
const Login = require("./Controllers/LoginController")
const WebSockets = require('./utils/websockectUtils')
const WebSocket = require('ws')
const AuthRoute = require('./Routes/Auth.Routes')


const app = express()
app.use(logger('dev'))
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))

app.use('/api', AuthRoute)

// app.use((err, req, res, next) => {
//     res.status(err.status || 500);
//     res.send({
//       error: {
//         status: err.status || 500,
//         message: err.message,
//       },
//     });
//   });

const port = 3000
app.set("port", port)
app.set('view engine', 'ejs')
// app.set('views')

const server = http.createServer(app)



app.get("/", (req, res) => {
    res.send("Hello world")
})


app.post('/register', Registration)
app.get('/profile', getProfile)
app.post('/login', Login)
// app.listen(3000, function () {
//     console.log("server started")
//     database.sync(function () {
//         console.log("database started")
//     })
// })

// https://cypherschhol.vercel.app/login


global.wss = new WebSocket.Server({ server })
global.wss.on('connection', WebSockets.connection)
server.listen(port, '0.0.0.0')
server.on('listening', () => {
    console.log('Server is running on port', port)
})




// app.listen(port, () => {
// console.log("Server is running on port", port);
// })