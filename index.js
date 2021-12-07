const http = require('http');
const express = require('express')
const TelegramBot = require('node-telegram-bot-api');
const token = "5069816784:AAFnugaFaKKHThDZ8m8zQTxRQgieZcKku8U";
const bot = new TelegramBot(token, {polling: true});
const { convert } = require('html-to-text');
var data = require('./modules/gaixinh');
const { AwakeHeroku } = require("awake-heroku");
const app = express();
app.get('/', function (req, res) {
  res.send('Developed by Hữu Hiếu')
})
console.log("App running port 3000");
app.listen(3000);
AwakeHeroku.add("https://your-app-nam-1.herokuapp.com");
bot.on('message', async msg => {
    const text = msg.text.trim();
    const chatId = msg.chat.id;
    if ( text === "/xinh"){
        data.data().then(response => {
            var obj = JSON.parse(response);
            var srcImg = obj['photo-url-1280'];
            var caption = obj['photo-caption'];
            bot.sendPhoto(chatId, srcImg);
            if(caption != ""){
              var result = convert(caption);
            var result =  result.replace("https://facebook.com/gaixinhchonloc",'');
            var result =  result.replace("#gaixinhchonloc",'');
            bot.sendMessage(chatId, result);
            }
           
           
          }).catch(err => {
            bot.sendMessage(chatId, err);
          });
    }
})

 
