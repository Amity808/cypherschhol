const JWT = require('jsonwebtoken');
const createError = require("http-errors")
const client = require('../utils/redis_connect')


const jwtHelper = {
    signAccessToken: (userId, type='') => {
        return new Promise ((resolve, reject) => {
            const payload = {}
            // TODO get the access token
            const secret = process.env.ACCESS_TOKEN_SECRET
            const options = {
                expiresIn: '24h',
                // issuer
                // issuer: process.env.ISSUER_URL,
                audience: userId
            }
            JWT.sign(payload, secret, options, (err, token) => {
                if(err){
                    console.log((err.message));
                    reject(createError.InternalServerError())
                    return
                }
                resolve(token)
            })
        })
    },
    verifyAccessToken: (req, res, next) => {
        if (!req.headers['authorization']) return next(createError.Unauthorized())
        const authHeader = req.headers['authorization']
        const bearerToken = authHeader.split('')
        const token = bearerToken[1]
        // TODO add accessToken 
        if (token == null) return res.sendStatus(401)
        JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
            if(err) {
                const message = err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message
                return next(createError.Unauthorized(message))
            }
            req.payload = payload
            next()
        })
    },
    refreshToken: (userId) => {
        return new Promise((resolve, reject) =>{
            const payload = {}
            const secret = process.env.REFRESH_TOKEN_SECRET
            const options = {
                expiresIn: '2y',
                // issuer: process.env.ISSUER,
                audience: userId
            }
            JWT.sign(payload, secret, options, (err, token) => {
                if(err) {
                    console.log(err.message);
                    reject(createError.InternalServerError())
                 
                }
                client.SET(userId, token, 'EX', 365 * 24 * 60 * 60, (err, reply) => {
                    if (err) {
                        console.log(err.message);
                        reject(createError.InternalServerError())
                        return
                    }
                    resolve(token)
                })
            })
        })
    },
    verifyRefreshToken: (refreshToken) => {
        return new Promise ((resolve, reject) => {
            JWT.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
                    if(err) return reject(createError.Unauthorized())
                    const userId = payload.aud
                client.GET(userId, (err, result) => {
                    if(err) {
                        console.log(err.message);
                        reject(createError.InternalServerError())
                        return
                    }
                    if (refreshToken === result) return resolve(userId)
                    reject(createError.Unauthorized())
                })
                })
        })
    }
}


export default jwtHelper