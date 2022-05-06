
require('dotenv').config();
const env = process.env;
const TelegramBot = require('node-telegram-bot-api');
const token = env.TELEGRAM_TOKEN || "token"; // Bot sự thật
const bot = new TelegramBot(token, { polling: true });
const covid = require('./modules/covid19');
const data = require('./modules/gaixinh');
const sim = require('./modules/simsimi');
const addGroup = require('./modules/addGroup');
const getListGroup = require('./modules/getAllGroup');
const getTikTok = require('./modules/tiktok');
const weather = require('./modules/weather');
const Telegram = () => {
    bot.onText(/^\. (.+)/, (msg, match) => {
        // 'msg' is the received Message from Telegram
        // 'match' is the result of executing the regexp above on the text content
        // of the message
      
        const chatId = msg.chat.id;
        const resp = match[1]; // the captured "whatever"
        console.log("Username:" + msg.from.username + "\n");
        console.log("Fullname:" + msg.from.first_name + " " + msg.from.last_name + "\n");
        console.log("Text:" + msg.text + "\n");
        console.log("Full:" + JSON.stringify(msg) + "\n");
        if (msg.chat.type === 'supergroup') {
          console.log("Group Id:" + msg.chat.id + "\n");
          console.log("Group Name:" + msg.chat.title + "\n");
        }
        sim.sim(resp).then(response => {
          var obj = JSON.parse(response);
          var msg = obj.success;
          bot.sendMessage(chatId, msg, { reply_to_message_id: msg.message_id });
        });
        // send back the matched "whatever" to the chat
      });
      bot.onText(/^\, (.+)/, (msg, match) => {
        // 'msg' is the received Message from Telegram
        // 'match' is the result of executing the regexp above on the text content
        // of the message
      
        const chatId = msg.chat.id;
        const resp = match[1]; // the captured "whatever"
        console.log("Username:" + msg.from.username + "\n");
        console.log("Fullname:" + msg.from.first_name + " " + msg.from.last_name + "\n");
        console.log("Text:" + msg.text + "\n");
        if (msg.chat.type === 'supergroup') {
          console.log("Group Id:" + msg.chat.id + "\n");
          console.log("Group Name:" + msg.chat.title + "\n");
        }
        sim.sim(resp).then(response => {
          var obj = JSON.parse(response);
          var msg = obj.success;
          // bot.sendMessage(chatId, msg);
          var url = 'https://translate.google.com/translate_tts?ie=UTF-8&q=' + msg + '&tl=vi&client=tw-ob';
          bot.sendAudio(chatId, url);
        });
        // send back the matched "whatever" to the chat
      Telegram();
          
      
      });
      bot.onText(/tiktok.com/, (msg, match) => {
        // 'msg' is the received Message from Telegram
        // 'match' is the result of executing the regexp above on the text content
        // of the message
        const chatId = msg.chat.id;
        const resp = msg.text; // the captured "whatever"
        console.log("Username:" + msg.from.username + "\n");
        console.log("Fullname:" + msg.from.first_name + " " + msg.from.last_name + "\n");
        console.log("Text:" + msg.text + "\n");
        if (msg.chat.type === 'supergroup') {
          console.log("Group Id:" + msg.chat.id + "\n");
          console.log("Group Name:" + msg.chat.title + "\n");
        }
        bot.sendMessage(chatId, "Đợi Xíu =))");
        getTikTok.getData(resp).then(response => {
          var data;
          if (response.data.hdplay != null) {
            data = response.data.hdplay;
          } else {
            data = response.data.wmplay;
          }
          // console.log();
          bot.sendMessage(chatId, response.data.title);
          bot.sendVideo(chatId, data);
      
        }).catch(err => {
          console.log(err);
          bot.sendMessage(chatId, "Từ từ thôi nào =))");
          // var url = ;
        })
      })
      // Bot listen region
      bot.on('message', async (msg) => {
        if(msg.text){
          const text = msg.text.trim();
          const chatId = msg.chat.id;
          console.log("Username:" + msg.from.username + "\n");
          console.log("Fullname:" + msg.from.first_name + " " + msg.from.last_name + "\n");
          console.log("Text:" + msg.text + "\n");
          if (msg.chat.type === 'supergroup') {
            console.log("Group Id:" + msg.chat.id + "\n");
            console.log("Group Name:" + msg.chat.title + "\n");
          }
          if (text.startsWith("/angi")) {
            var monan = [
              'bún bò Huế',
              'cơm',
              'gì cũng được'
            ];
            bot.sendMessage(chatId, "Hôm nay ăn " + monan[~~(Math.random() * monan.length)]);
          }
        
          if (text.startsWith("/weather")) {
            console.log("Username:" + msg.from.username + "\n");
            console.log("Fullname:" + msg.from.first_name + " " + msg.from.last_name + "\n");
            console.log("Text:" + msg.text + "\n");
            if (msg.chat.type === 'supergroup') {
              console.log("Group Id:" + msg.chat.id + "\n");
              console.log("Group Name:" + msg.chat.title + "\n");
            }
            weather.getCurrent().then(response => {
              var data = response;
              var messageContent = "*Thời tiết hiện tại in BKASOFT\* \n";
              messageContent += "\- Thời gian: " + unixTime.timeConverter(data.dt) + "\n";
              messageContent += "\- Hiện tại: " + data.weather[0].description + "\n";
              messageContent += "\- Nhiệt độ: " + data.main.temp + " °C cảm giác như " + data.main.feels_like + " °C \n";
              messageContent += "\- Nhiệt độ thấp nhất: " + data.main.temp_min + " °C \n";
              messageContent += "\- Nhiệt độ cao nhất: " + data.main.temp_max + " °C \n";
              messageContent += "\- Độ ẩm: " + data.main.humidity + " % \n";
              messageContent += "\- Mây: " + data.clouds.all + " % \n";
              bot.sendMessage(chatId, messageContent, {
                parse_mode: "Markdown"
              });
            }).catch(err => {
              console.log(err);
              bot.sendMessage(chatId, "Từ từ thôi nào =))");
              // var url = ;
            })
          }
        
          if (text.startsWith("/hourweather")) {
            console.log("Username:" + msg.from.username + "\n");
            console.log("Fullname:" + msg.from.first_name + " " + msg.from.last_name + "\n");
            console.log("Text:" + msg.text + "\n");
            if (msg.chat.type === 'supergroup') {
              console.log("Group Id:" + msg.chat.id + "\n");
              console.log("Group Name:" + msg.chat.title + "\n");
            }
            weather.getHoursly().then(response => {
              var data = response;
              var currentTime = data.current.dt;
              var arr = [];
              var limit = 8;
              var start = 1;
              data.hourly.forEach(hour => {
                if (hour.dt > currentTime) {
                  if (start < limit) {
                    arr.push(hour);
                    start++;
                  }
                }
              })
              arr.sort((a, b) => {
                return a.dt - b.dt;
              });
              var content = "* Thời tiết tại BKASOFT\* \n \n";
              arr.forEach(hour => {
                if (hour.dt > currentTime) {
                  var messageContent = "* Thời gian: " + unixTime.timeConverter(hour.dt) + "\* \n";
                  messageContent += "\- Trạng thái: " + hour.weather[0].description + "\n";
                  messageContent += "\- Nhiệt độ: " + hour.temp + " °C cảm giác như " + hour.feels_like + " °C \n";
                  messageContent += "\- Mây: " + hour.clouds + " % \n";
                  content += messageContent+"\n";
                }
              })
              bot.sendMessage(chatId, content, {
                parse_mode: "Markdown"
              });
            }).catch(err => {
              console.log(err);
              bot.sendMessage(chatId, "Từ từ thôi nào =))");
              // var url = ;
            })
          }
        
          if (text.startsWith("/trending")) {
            console.log("Username:" + msg.from.username + "\n");
            console.log("Fullname:" + msg.from.first_name + " " + msg.from.last_name + "\n");
            console.log("Text:" + msg.text + "\n");
            if (msg.chat.type === 'supergroup') {
              console.log("Group Id:" + msg.chat.id + "\n");
              console.log("Group Name:" + msg.chat.title + "\n");
            }
            bot.sendMessage(chatId, "Đợi Xíu =))");
            getTikTok.getTrending().then(response => {
              var data = response.data[Math.floor(Math.random() * response.data.length)];
              var title = data.title;
              if (data.hdplay != null) {
                data = data.hdplay;
              } else {
                data = data.wmplay;
              }
              bot.sendMessage(chatId, title);
              bot.sendVideo(chatId, data);
        
            }).catch(err => {
              console.log(err);
              bot.sendMessage(chatId, "Từ từ thôi nào =))");
              // var url = ;
            })
          }
          if (text.startsWith("/search")) {
            console.log("Username:" + msg.from.username + "\n");
            console.log("Fullname:" + msg.from.first_name + " " + msg.from.last_name + "\n");
            console.log("Text:" + msg.text + "\n");
            if (msg.chat.type === 'supergroup') {
              console.log("Group Id:" + msg.chat.id + "\n");
              console.log("Group Name:" + msg.chat.title + "\n");
            }
            bot.sendMessage(chatId, "Đợi Xíu =))");
            var keyword = msg.text.replace("/search", "");
            getTikTok.searchVideo(keyword).then(response => {
              if (response.data.videos) {
                var data = response.data.videos[Math.floor(Math.random() * response.data.videos.length)];
                var title = data.title;
                if (data.hdplay != null) {
                  data = data.hdplay;
                } else {
                  data = data.wmplay;
                }
                bot.sendMessage(chatId, title);
                bot.sendVideo(chatId, data);
              } else {
                bot.sendMessage(chatId, "Không tìm thấy kết quả");
              }
            }).catch(err => {
              console.log(err);
              bot.sendMessage(chatId, "Từ từ thôi nào =))");
              // var url = ;
            })
          }
          if (text.startsWith("/sexy")) {
            console.log("Username:" + msg.from.username + "\n");
            console.log("Fullname:" + msg.from.first_name + " " + msg.from.last_name + "\n");
            console.log("Text:" + msg.text + "\n");
            if (msg.chat.type === 'supergroup') {
              console.log("Group Id:" + msg.chat.id + "\n");
              console.log("Group Name:" + msg.chat.title + "\n");
            }
            var url = 'https://translate.google.com/translate_tts?ie=UTF-8&q=Bớt bớt lại đi bạn ơi&tl=vi&client=tw-ob';
            bot.sendAudio(chatId, url);
          }
        
          if (text.startsWith("/tudongguithongbaocovid")) {
            console.log("Username:" + msg.from.username + "\n");
            console.log("Fullname:" + msg.from.first_name + " " + msg.from.last_name + "\n");
            console.log("Text:" + msg.text + "\n");
            if (msg.chat.type === 'supergroup') {
              console.log("Group Id:" + msg.chat.id + "\n");
              console.log("Group Name:" + msg.chat.title + "\n");
            }
            addGroup.addGroup(chatId);
            bot.sendMessage(chatId, "Đã đăng ký!");
          }
          if (text.startsWith("/help")) {
            console.log("Username:" + msg.from.username + "\n");
            console.log("Fullname:" + msg.from.first_name + " " + msg.from.last_name + "\n");
            console.log("Text:" + msg.text + "\n");
            if (msg.chat.type === 'supergroup') {
              console.log("Group Id:" + msg.chat.id + "\n");
              console.log("Group Name:" + msg.chat.title + "\n");
            }
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
            console.log("Username:" + msg.from.username + "\n");
            console.log("Fullname:" + msg.from.first_name + " " + msg.from.last_name + "\n");
            console.log("Text:" + msg.text + "\n");
            if (msg.chat.type === 'supergroup') {
              console.log("Group Id:" + msg.chat.id + "\n");
              console.log("Group Name:" + msg.chat.title + "\n");
            }
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
            console.log("Username:" + msg.from.username + "\n");
            console.log("Fullname:" + msg.from.first_name + " " + msg.from.last_name + "\n");
            console.log("Text:" + msg.text + "\n");
            if (msg.chat.type === 'supergroup') {
              console.log("Group Id:" + msg.chat.id + "\n");
              console.log("Group Name:" + msg.chat.title + "\n");
            }
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
            console.log("Username:" + msg.from.username + "\n");
            console.log("Fullname:" + (msg.from.first_name == null ? '' : msg.from.first_name) + " " + (msg.from.last_name == null ? '' : msg.from.last_name) + "\n");
            console.log("Text:" + msg.text + "\n");
            if (msg.chat.type === 'supergroup') {
              console.log("Group Id:" + msg.chat.id + "\n");
              console.log("Group Name:" + msg.chat.title + "\n");
            }
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
            var name = msg.from.first_name + " " + msg.from.last_name + loikhen[~~(Math.random() * loikhen.length)];
            bot.sendMessage(chatId, name);
          }
        }
    });
}
const gitLabMessage = (result,id) => {
  switch(result?.type){
    case "push":
      
      var messageContent = `*${result?.user?.name}\* push to [${result?.project?.namespace}/${result?.project?.name}](${result?.project?.urls?.repository}) \n`;
      if(result){
          result?.commit?.forEach(commit => {
              messageContent+= `*${commit?.author?.name}\* : [${commit?.message}](${commit?.url}) \n`;
          })
      }
      bot.sendMessage(id,messageContent, {
        parse_mode: "Markdown"
      });
      break;
    default:
      break;
  }
}
module.exports = {
  Telegram,
  gitLabMessage
}