const http = require('http');
const express = require('express')
const TelegramBot = require('node-telegram-bot-api');
const token = "5069816784:AAFnugaFaKKHThDZ8m8zQTxRQgieZcKku8U";
// const token = "5024645658:AAH8cX8s60kfCXw6s4J2x18DoiveE4XaQL0";

const bot = new TelegramBot(token, { polling: true });
const { convert } = require('html-to-text');
const fs = require('fs');
var covid = require('./modules/covid19');
var data = require('./modules/gaixinh');
const { response } = require('express');


const app = express();
app.get('/', function (req, res) {
  res.send('Developed by Hữu Hiếu')
})
console.log("App running port 3000");
app.listen(process.env.PORT || 3000);


// Bot listen region
bot.on('message', async msg => {
  const text = msg.text.trim();
  const chatId = msg.chat.id;
  if(text === "/help"){
    var messageContent = "*Danh sách các lệnhh:\* \n";
      messageContent+= "\- \/xinh : Xem ảnh gái xinh đẹp mlem mlem \n";
      messageContent+= "\- \/covid : Thông tin covid-19 Hà Nội và Việt Nam\n";
      bot.sendMessage(chatId, messageContent,{
        parse_mode: "Markdown"
      });
  }
  if (text === "/xinh") {
    data.data().then(response => {
      var obj = JSON.parse(response);
      var srcImg = obj['photo-url-1280'];
      // var caption = obj['photo-caption'];
      bot.sendPhoto(chatId, srcImg);
      // if(caption != ""){
      //   var result = convert(caption);
      // var result =  result.replace("https://facebook.com/gaixinhchonloc",'');
      // var result =  result.replace("#gaixinhchonloc",'');
      // bot.sendMessage(chatId, result);
      // }
    }).catch(err => {
      bot.sendMessage(chatId, err);
    });
  }
  if (text === "/covid") {
    // Write Javascript code here
    covid.covid().then(response => {
        var today = new Date();
        var date = today.getDate()+ '\-' + (today.getMonth()+1) + '\-' +today.getFullYear();
        var arr = response;
        var messageContent = "*Thông tin covid 19 (" + date+ ")\* \n";
        messageContent+= "Hà Nội: \n";
        messageContent+= "\- Số ca hôm nay: "+ arr.hanoi.casesToday + "\n";
        messageContent+= "\- Tổng số ca: "+ arr.hanoi.cases + "\n";
        messageContent+= "\- Tử vong: "+ arr.hanoi.death + "\n";
        messageContent+= "Cả nước: \n";
        messageContent+= "\- Tổng số ca: "+ arr.canuoc.cases + "\n";
        messageContent+= "\- Tử vong: "+ arr.canuoc.death + "\n";
        messageContent+= "\- Đang điều trị: "+ arr.canuoc.treating + "\n";
        messageContent+= "\- Phục hồi: "+ arr.canuoc.recovered + "\n";
       
        console.log(arr.hanoi);
        bot.sendMessage(chatId, messageContent,{
          parse_mode: "Markdown"
        });
    }).catch(err => {
        console.log(err);
        bot.sendMessage(chatId, "Lỗi");
    })
  }
});



setInterval(function () {
  http.get("http://gaixinhbot.herokuapp.com");
  console.log("Wakeup Now !!");
}, 300000); // every 5 minutes (300000)

