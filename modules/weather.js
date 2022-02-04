
const axios = require('axios');
async function getCurrent() {
    var res = await axios.get('https://api.openweathermap.org/data/2.5/weather?lat=21.004092121254985&lon=105.8476391830324&units=metric&lang=vi&appid=' + process.env.OPEN_WEATHER_API_KEY);
    return res.data;
}
async function getHoursly() {
    var res = await axios.get('https://api.openweathermap.org/data/2.5/onecall?lat=21.004092121254985&lon=105.8476391830324&exclude=daily,minutely&units=metric&lang=vi&appid=' + process.env.OPEN_WEATHER_API_KEY);
        return res.data;
}
module.exports = {
    getCurrent: () => {
        return new Promise((resolve, reject) => {
            getCurrent().then(res =>resolve(res)).catch(err => reject(err))
        });
    },
    getHoursly: () => {
        return new Promise((resolve, reject) => {
            getHoursly().then(res => resolve(res)).catch(err => reject(err))
        });
    },
    getByLatLon: (lat, lon) => {
        return new Promise((resolve, reject) => {
            getByLatLon(lat, lon).then(res => resolve(res))
        });
    }
};