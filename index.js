const http = require('http');
const express = require('express')
const TelegramBot = require('node-telegram-bot-api');
// const token = "5069816784:AAE-m0KgKpYnol3aMfviZ78Z7ezHTGysZEc"; //Gái xinh bot
const token = "5024645658:AAH8cX8s60kfCXw6s4J2x18DoiveE4XaQL0"; // Bot sự thật
var chat_id = [
  "-548545018"
];

const bot = new TelegramBot(token, { polling: true });

var covid = require('./modules/covid19');
var data = require('./modules/gaixinh');
var sim = require('./modules/simsimi');
const { response } = require('express');


const app = express();
app.get('/', function (req, res) {
  res.send('Developed by Hữu Hiếu')
})
console.log("App running port 3000");
app.listen(process.env.PORT || 3000);
// wakeup bot
setInterval(function () {
  http.get("http://gaixinhbot.herokuapp.com");
  console.log("Wakeup Now !!");
  scheduleSendMessageCovid();
}, 300000); // every 5 minutes (300000)

bot.onText(/\. (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"
  sim.sim(resp).then(response => {
    var obj = JSON.parse(response);
    var msg = obj.success;
    bot.sendMessage(chatId, msg);
  });
  // send back the matched "whatever" to the chat
  
}); 
// Bot listen region
bot.on('message', async msg => {
  const text = msg.text.trim();
  const chatId = msg.chat.id;
  if (text.startsWith("/angi")){
    var monan = [
      'bún bò Huế',
      'cơm',
      'gì cũng được'
    ];
    bot.sendMessage(chatId, "Hôm nay ăn " +monan[~~(Math.random()* monan.length)]);
  }
  if (text.startsWith("/sexy")){
    var url = 'https://translate.google.com/translate_tts?ie=UTF-8&q=Thằng đồi truỵ này&tl=vi&client=tw-ob';
    bot.sendAudio(chatId,url);
  }
  if (text.startsWith("/tudongguithongbaocovid")) {
    checkGroup(chatId);
    bot.sendMessage(chatId, "Chức năng đ hoạt động!");
  }
  if (text.startsWith("/help")) {
    var messageContent = "*Danh sách các lệnhh:\* \n";
    messageContent += "\- \/xinh : Xem ảnh gái xinh đẹp mlem mlem \n";
    messageContent += "\- \/angi : Chọn xem hôm nay sẽ ăn gì \n";
    messageContent += "\- \/covid : Thông tin covid-19 Hà Nội và Việt Nam\n";
    messageContent += "\- \/tudongguithongbaocovid : Đăng ký nhận thông tin covid-19 Hà Nội và Việt Nam\n";
    bot.sendMessage(chatId, messageContent, {
      parse_mode: "Markdown"
    });
  }
  if (text.startsWith("/xinh")) {
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
  if (text.startsWith("/covid")) {
    // Write Javascript code here
    covid.covid().then(response => {
      var today = new Date();
      var date = today.getDate() + '\-' + (today.getMonth() + 1) + '\-' + today.getFullYear();
      var arr = response;
      var messageContent = "*Thông tin covid 19 (" + date + ")\* \n";
      messageContent += "Hà Nội: \n";
      messageContent += "\- Số ca hôm nay: " + arr.hanoi.casesToday + "\n";
      messageContent += "\- Tổng số ca: " + arr.hanoi.cases + "\n";
      messageContent += "\- Tử vong: " + arr.hanoi.death + "\n";
      messageContent += "Cả nước: \n";
      messageContent += "\- Tổng số ca: " + arr.canuoc.cases + "\n";
      messageContent += "\- Tử vong: " + arr.canuoc.death + "\n";
      messageContent += "\- Đang điều trị: " + arr.canuoc.treating + "\n";
      messageContent += "\- Phục hồi: " + arr.canuoc.recovered + "\n";
      bot.sendMessage(chatId, messageContent, {
        parse_mode: "Markdown"
      });
    }).catch(err => {
      console.log(err);
      bot.sendMessage(chatId, "Lỗi");
    })
  }
  if (text.startsWith("/khen")) {
    var loikhen = [
      ' xinh đẹp vcl',
      ' là 1 con bóng chính hiệu',
      ' , bạn là tiên nữ giáng trần',
      ' dễ thương quá, cho nựng cái',
      ' là người con gái đẹp nhất tôi từng gặp',
      ' thật mạnh mẽ',
      ' là con bóng gồng',
      ' -> chúa tể bê đê',
      ' gì cũng biết, gì cũng hay',
      ' là nhất, là số một',
    ];
    var name = msg.from.first_name + " " + msg.from.last_name +loikhen[~~(Math.random()* loikhen.length)];
    bot.sendMessage(chatId, name);
  }

  // tinh nang bi mat
  if (removeAccents(text).toLowerCase().replace(" ", "").includes("quanganh")) {
    // console.log(removeAccents(text).toLowerCase().replace(" ",""));
    var name = "Ối dồi ôi làng nước ơi, ai đó vừa nhắc đến mỹ nữ Quang Anh kìa 😮";
    bot.sendMessage(chatId, name);
  }

  if (removeAccents(text).toLowerCase().replace(" ", "").includes("thai")) {
    var name = "Quang Anh yêu Thái 😮";
    bot.sendMessage(chatId, name);
  }
});
function scheduleSendMessageCovid() {
  const d = new Date();
  let hour = d.getHours(); // 3600 2
  let min = d.getMinutes();
  let second = d.getSeconds();
  if (hour === 7 && min <= 6 || hour === 19 && min <= 6) {
    console.log("call function broadcast send msg - time:" + hour +":" + min);
    bot.on('message', async msg => {
      chat_id.forEach(i =>
        covid.covid().then(response => {
          var today = new Date();
          var date = today.getDate() + '\-' + (today.getMonth() + 1) + '\-' + today.getFullYear();
          var arr = response;
          var messageContent = "*Thông tin covid 19 (" + date + ")\* \n";
          messageContent += "Hà Nội: \n";
          messageContent += "\- Số ca hôm nay: " + arr.hanoi.casesToday + "\n";
          messageContent += "\- Tổng số ca: " + arr.hanoi.cases + "\n";
          messageContent += "\- Tử vong: " + arr.hanoi.death + "\n";
          messageContent += "Cả nước: \n";
          messageContent += "\- Tổng số ca: " + arr.canuoc.cases + "\n";
          messageContent += "\- Tử vong: " + arr.canuoc.death + "\n";
          messageContent += "\- Đang điều trị: " + arr.canuoc.treating + "\n";
          messageContent += "\- Phục hồi: " + arr.canuoc.recovered + "\n";
          bot.sendMessage(i, messageContent, {
            parse_mode: "Markdown"
          });
          console.log("call function broadcast send msg - time:" + hour +":" + min);
        }).catch(err => {
          console.log(err);
          bot.sendMessage(chatId, "Lỗi");
        })
      );

    })
  }


}
function checkGroup(chatId) {
  console.log(chat_id);
  if (Array.isArray(chat_id) && !chat_id.length) {
    if (chat_id.length <= 0 || !chat_id.includes(chatId)) {
      chat_id.push(chatId);
    }
  }

}

function removeAccents(str) {
  var AccentsMap = [
    "aàảãáạăằẳẵắặâầẩẫấậ",
    "AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ",
    "dđ", "DĐ",
    "eèẻẽéẹêềểễếệ",
    "EÈẺẼÉẸÊỀỂỄẾỆ",
    "iìỉĩíị",
    "IÌỈĨÍỊ",
    "oòỏõóọôồổỗốộơờởỡớợ",
    "OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ",
    "uùủũúụưừửữứự",
    "UÙỦŨÚỤƯỪỬỮỨỰ",
    "yỳỷỹýỵ",
    "YỲỶỸÝỴ"
  ];
  for (var i = 0; i < AccentsMap.length; i++) {
    var re = new RegExp('[' + AccentsMap[i].substr(1) + ']', 'g');
    var char = AccentsMap[i][0];
    str = str.replace(re, char);
  }
  return str;
}