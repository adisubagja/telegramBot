const { rejects } = require('assert');
var http = require('http');
const { resolve } = require('path');
var url = "http://api.huuhieu.net/gxcl/";

function Data(){
    
}
module.exports = {
    data: () => {
        return new Promise((resolve,reject) => {
            http.get(url,function(res){
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


// function storeData(data){
//     object = data;
//     console.log(object);
// }
