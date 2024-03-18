const redis = require('redis')

const client = redis.createClient({
    port: 17682,
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD, 
    
    
})

client.on('connect', () => {
    console.log('Client connected to redis....');
})

client.on('ready', () => {
    console.log('Connect to redis, ready to use');
})

client.on('error', (err) => {
    console.log(err.message);
})

client.on('end', () => {
    console.log('client disconnected from redis');

})

client.on('SIGINT', () => {{
    client.quit()
}})

module.exports = client