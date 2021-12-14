const https = require('https');
module.exports = {
    sim : (message) => {
        return new Promise((resolve, reject) => {
            https.get("https://api.simsimi.net/v2/?text="+ message+"&lc=vn",function(res){
                var body = "";
                var object = [];
                res.on('data',function(chunk){
                     body+= chunk;
                })
                res.on('end',function(){
                    if(res.statusCode === 200){
                        object.push(body);
                        object.join("");
                        resolve(object);
                        console.log(object);
                    }
                    
                })
            }).on('error', function(e){
                console.log(e);
             });
        })
    }
}