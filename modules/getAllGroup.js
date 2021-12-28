const { rejects } = require('assert');
var https = require('https');
const { resolve } = require('path');
var url = process.env.APP_URL+"/list-group";
module.exports = {
    getListGroup: () => {
        return new Promise((resolve,reject) => {
            https.get(url,function(res){
                var body = "";
                var object = [];
                res.on('data', function(chunk){
                    body += chunk;
                });
                res.on('end', function(){
                    if(res.statusCode === 200){
                            data = body;
                            if(data != null){
                                object.push(data);
                                object.join("");
                                resolve(object);
                            }
                           
                    }
                // đã lấy được json
                });
            }).on('error', function(e){
               console.log(e);
            });
        })
       
    }
}