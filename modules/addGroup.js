require('dotenv').config();
const env = process.env;
var axios = require('axios');
module.exports = {
    
    addGroup: (groupId) => {
        return new Promise((resolve,reject)=>{
            axios.post(process.env.APP_URL+'/add-group',{groupId: groupId}).then(res => {
                resolve(res) ;
            }).catch(error => {
                console.error (error);
            });
        })
       
    }
}