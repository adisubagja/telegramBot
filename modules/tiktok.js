
const axios = require('axios');
async function getTikTok(url) {
   
         var res = await axios
        .post('https://www.tikwm.com/api/', {
                url: url,
                count: 12,
                cursor: 0,
                hd: 1
        });
        if(res.status == 200){
            // test for status you want, etc
            console.log(res.status);
            return res.data;
        }    
       
}
module.exports = {
    getData : (url) => {
        return new Promise((resolve,reject) => {
            getTikTok(url).then(res => resolve(res))
        });
    }
};