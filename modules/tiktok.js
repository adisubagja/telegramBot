
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
async function getTrending() {
   
    var res = await axios
   .post('https://www.tikwm.com/api/feed/list', {
            region : 'VN',
            'count' : 10,
            hd: 1
   });
   if(res.status == 200){
       // test for status you want, etc
       console.log(res.status);
       return res.data;
   }    
  
}
async function searchVideo(keyword) {
   
    var res = await axios
   .post('https://www.tikwm.com/api/feed/search', {
        keywords : keyword,
        count : 10,
        cursor : 0,
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
    },
    getTrending : () => {
        return new Promise((resolve,reject) => {
            getTrending().then(res => resolve(res))
        });
    },
    searchVideo : (keyword) => {
        return new Promise((resolve,reject) => {
            searchVideo(keyword).then(res => resolve(res))
        });
    }
};