var axios = require('axios');
module.exports = {
    addGroup: (groupId) => {
        axios.post('/',{groupId: groupId}).then(res => {
            return res;
        }).catch(error => {
            return error;
        });
    }
}