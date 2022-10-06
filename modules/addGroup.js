require('dotenv').config();
const env = process.env;
var https = require('https');
module.exports = {
    
    addGroup: (groupId) => {
        return new Promise((resolve,reject)=>{
            const data = JSON.stringify({
                groupId: groupId
              })
              
              const options = {
                hostname: 'gaixinhbot.herokuapp.com',
                port: 443,
                path: '/add-group',
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Content-Length': data.length
                }
              }
              const body = []
              const req = https.request(options, res => {
                res.on('data', d => {
                  process.stdout.write(d)
                })
              })
              res.on('end', () => {
                
                const resString = Buffer.concat(body).toString()
                resolve(resString)
              })
              req.on('error', error => {
                console.error(error)
                reject(error)
              })
              
              req.write(data)
              req.end()
        })
       
    }
}