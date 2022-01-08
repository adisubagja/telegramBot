require('dotenv').config();
const axios = require('axios')


const env = process.env;
var https = require('https');
module.exports = {
     getTikTok: (url) => {
        return new Promise((resolve,reject) => {
            axios
            .post('https://www.tikwm.com/api/', {
                    url: url,
                    count: 12,
                    cursor: 0,
                    hd: 1
            })
            .then(res => {
               resolve(res.data);
            })
            .catch(error => {
                console.error(error)
            })
        })
    }
    // getTikTok: (url) => {
    //     return new Promise((resolve, reject) => {

    //         const data = JSON.stringify({
    //             url: url,
    //             count: 12,
    //             cursor: 0,
    //             hd: 1
    //         })
    //         const options = {
    //             hostname: 'www.tikwm.com',
    //             port: 443,
    //             path: '/api/',
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/x-www-form-urlencoded',
    //                 'Content-Length': Buffer.byteLength(data)
    //             }
    //         }
    //         var object = [];
    //         var rs = "";
    //         const req = https.request(options, res => {
    //             res.setEncoding('utf8');
    //             res.on('data', (chunk) => {
    //                 //   process.stdout.write(d);
    //                 setTimeout(function () {
    //                     rs += chunk;
    //                     if (object != null) {
    //                         object.push(rs);
    //                         object.join("");
    //                     }
    //                     console.log(object);
    //                     resolve(object);
    //                 }, 2000)
    //             })
    //         })
    //         req.on('finish', function () {



    //         })
    //         req.on('error', error => {
    //             console.error(error)
    //         })
    //         req.write(data)
    //         req.end()

    //     })

    // }
}