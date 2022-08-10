const { rejects } = require('assert');
var http = require('https');
const { resolve } = require('path');


module.exports = {
    data: () => {
        return new Promise((resolve,reject) => {
            var number = Math.floor(Math.random() * 957);
            var url = "https://gaixinhchonloc.com/api/read/json?start="+number+"&num=1";
            http.get(url,function(res){
                console.log(url)
                var body = "";
                var object = [];
                res.on('data', function(chunk){
                    console.log(chunk)
                    body += chunk;
                });
                res.on('end', function(){
                    if(res.statusCode === 200){
                            data = body;
                            data = data.split("var tumblr_api_read = ");
                            data = data[1].slice(0,-2)
                            data = JSON.parse(data)
                            data = data.posts[0];
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
