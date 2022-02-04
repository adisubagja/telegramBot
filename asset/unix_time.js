function timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['01', '02', '03', '04', '05', '06', '07','08', '09', '10', '11', '12'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = (date < 10 ? '0'+date : date) + '/' + month + '/' + year + ' ' + (hour < 10 ? '0'+hour : hour) + ':' + (min < 10 ? '0'+min : min) + (sec == 0 ? '' : ':' + sec) ;
    return time;
}
module.exports = {
    timeConverter
}