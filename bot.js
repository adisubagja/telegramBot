require("dotenv").config();
const env = process.env;
const TelegramBot = require("node-telegram-bot-api");
const token = env.TELEGRAM_TOKEN || "token"; // Bot sự thật
const bot = new TelegramBot(token, { polling: true });
const covid = require("./modules/covid19");
const data = require("./modules/gaixinh");
const sim = require("./modules/simsimi");
const getTikTok = require("./modules/tiktok");
const weather = require("./modules/weather");
const unixTime = require("./asset/unix_time");
const { getBranchName } = require("./asset/removeString");
const CreateImage = require("./utils/create-image");
const { getVnExpress } = require("./modules/vnexpress");
const analyzeImage = require("./modules/analyzeImage");
const { translate } = require("free-translate");
const Telegram = () => {
  bot.onText(/^\. (.+)/, (msg, match) => {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message

    const chatId = msg.chat.id;
    const resp = match[1]; // the captured "whatever"
    console.log("Username:" + msg.from.username + "\n");
    console.log(
      "Fullname:" + msg.from.first_name + " " + msg.from.last_name + "\n"
    );
    console.log("Text:" + msg.text + "\n");
    console.log("Full:" + JSON.stringify(msg) + "\n");
    if (msg.chat.type === "supergroup") {
      console.log("Group Id:" + msg.chat.id + "\n");
      console.log("Group Name:" + msg.chat.title + "\n");
    }
    sim.sim(resp).then((response) => {
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
    console.log(
      "Fullname:" + msg.from.first_name + " " + msg.from.last_name + "\n"
    );
    console.log("Text:" + msg.text + "\n");
    if (msg.chat.type === "supergroup") {
      console.log("Group Id:" + msg.chat.id + "\n");
      console.log("Group Name:" + msg.chat.title + "\n");
    }
    sim.sim(resp).then((response) => {
      var obj = JSON.parse(response);
      var msg = obj.success;
      // bot.sendMessage(chatId, msg);
      var url =
        "https://translate.google.com/translate_tts?ie=UTF-8&q=" +
        msg +
        "&tl=vi&client=tw-ob";
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
    console.log(
      "Fullname:" + msg.from.first_name + " " + msg.from.last_name + "\n"
    );
    console.log("Text:" + msg.text + "\n");
    if (msg.chat.type === "supergroup") {
      console.log("Group Id:" + msg.chat.id + "\n");
      console.log("Group Name:" + msg.chat.title + "\n");
    }
    bot.sendMessage(chatId, "Fetching Data ...");
    getTikTok
      .getData(resp)
      .then((response) => {
        var data;
        if (response.data.hdplay != null) {
          data = response.data.hdplay;
        } else {
          data = response.data.wmplay;
        }
        // console.log();
        bot.sendMessage(chatId, response.data.title);
        bot.sendVideo(chatId, data);
      })
      .catch((err) => {
        console.log(err);
        bot.sendMessage(chatId, "Try again");
        // var url = ;
      });
  });

  bot.on("photo",async(msg)=>{
    const chatId = msg.chat.id;
    const message_id = msg.message_id;
    const photo = msg.photo;
    if(photo.length > 0){
      bot.getFileLink(photo[photo.length -1].file_id).then(stream=>{
        analyzeImage.analyzeImage(stream,"Adult").then(res=>{
          if(res){
            console.log("res")
            const {adult} = JSON.parse(res);
            if(adult.isAdultContent === true){
              bot.sendMessage(chatId,"Đạo đức ở đâu? Thuần phong mỹ tục ở đâu? Link ở đâu?",{ reply_to_message_id: msg.message_id })
            }
            if(adult.isGoryContent === true){
              bot.sendMessage(chatId,"Ảnh kinh dị quá",{ reply_to_message_id: msg.message_id })
            }
          }
        }).catch((e)=>{
          console.log(e)
           bot.sendMessage(chatId,"Unable connect to https://ai.huuhieu.name.vn",{ reply_to_message_id: msg.message_id })
        })
        analyzeImage.analyzeImage(stream,"Faces").then(res=>{
          if(res){
            const {faces} = JSON.parse(res);
            if(faces.length <= 0){return ;}
            bot.sendMessage(chatId,`Giới tính: ${!faces[0].gender ? "Không xác định" : faces[0].gender === "Male" ? "Nam" : "Nữ"}, Tuổi: ${faces[0].age ?? "Không xác định"}`,{ reply_to_message_id: msg.message_id })
          }
        }).catch((e)=>{
          console.log(e)
           bot.sendMessage(chatId,"Unable connect to https://ai.huuhieu.name.vn",{ reply_to_message_id: message_id })
        })
        analyzeImage.analyzeImage(stream,"Description").then(async res=>{
          if(res){
            const {description} = JSON.parse(res);
            if(description.captions.length <= 0){return ;}
            const translatedText = await translate(description.captions[0].text,{to:"vi"});
            bot.sendMessage(chatId,translatedText ?? ".",{ reply_to_message_id: message_id })
          }
        }).catch((e)=>{
          console.log(e)
           bot.sendMessage(chatId,"Unable connect to https://ai.huuhieu.name.vn",{ reply_to_message_id: msg.message_id })
        })
      })
    }
  })

  bot.on("new_chat_members",async (msg)=>{
    const chatId = msg.chat.id;
    const participant = msg.new_chat_participant;
    bot.sendMessage(
      chatId,
      `Xin chào *${participant.first_name ?? ""} ${
        participant.last_name ?? ""
      }* 👋`,
      {
        parse_mode: "Markdown",
      }
    );
  })
  bot.on("left_chat_member",async (msg)=>{
    const chatId = msg.chat.id;
    const participant = msg.left_chat_member;
    bot.sendMessage(
      chatId,
      `Tạm biệt *${participant.first_name ?? ""} ${
        participant.last_name ?? ""
      }*`,
      {
        parse_mode: "Markdown",
      }
    );
  })
  // Bot listen region
  bot.on("message", async (msg) => {
    var messageId = msg.message_id;
    if (msg.text) {
      const text = msg.text.trim();
      const chatId = msg.chat.id;
      console.log("Username:" + msg.from.username + "\n");
      console.log(
        "Fullname:" + msg.from.first_name + " " + msg.from.last_name + "\n"
      );
      console.log("Text:" + msg.text + "\n");
      if (msg.chat.type === "supergroup") {
        console.log("Group Id:" + msg.chat.id + "\n");
        console.log("Group Name:" + msg.chat.title + "\n");
      }
      if (text.startsWith("/angi")) {
        var monan = ["bún bò Huế", "cơm", "gì cũng được"];
        bot.sendMessage(
          chatId,
          "Hôm nay ăn " + monan[~~(Math.random() * monan.length)],
          {
            reply_to_message_id: messageId,
          }
        );
      }
      if (text.startsWith("/news")) {
        let news = await getVnExpress();
        let createImage = new CreateImage();
        let images = [];
        await bot.sendMessage(chatId, "Đang lấy dữ liệu", {
          reply_to_message_id: messageId,
          file: "buffer",
        });
        for (const feed of news) {
          if (images.length < 9) {
            images.push({
              media: await createImage.create(
                feed.img,
                feed.title,
                feed.description
              ),
              type: "photo",
            });
          }
        }

        await bot.sendMediaGroup(chatId, images, {
          reply_to_message_id: messageId,
          file: "buffer",
        });
        // for(var img of images){
        //   // console.log(img)
        //   await bot.sendPhoto(chatId, img, {
        //     reply_to_message_id: messageId
        //   });
        // }
      }
      if (text.startsWith("/weather")) {
        console.log("Username:" + msg.from.username + "\n");
        console.log(
          "Fullname:" + msg.from.first_name + " " + msg.from.last_name + "\n"
        );
        console.log("Text:" + msg.text + "\n");
        if (msg.chat.type === "supergroup") {
          console.log("Group Id:" + msg.chat.id + "\n");
          console.log("Group Name:" + msg.chat.title + "\n");
        }
        weather
          .getCurrent()
          .then((response) => {
            var data = response;
            var messageContent = "*Thời tiết hiện tại in BKASOFT* \n";
            messageContent +=
              "- Thời gian: " + unixTime.timeConverter(data.dt) + "\n";
            messageContent +=
              "- Hiện tại: " + data.weather[0].description + "\n";
            messageContent +=
              "- Nhiệt độ: " +
              data.main.temp +
              " °C cảm giác như " +
              data.main.feels_like +
              " °C \n";
            messageContent +=
              "- Nhiệt độ thấp nhất: " + data.main.temp_min + " °C \n";
            messageContent +=
              "- Nhiệt độ cao nhất: " + data.main.temp_max + " °C \n";
            messageContent += "- Độ ẩm: " + data.main.humidity + " % \n";
            messageContent += "- Mây: " + data.clouds.all + " % \n";
            bot.sendMessage(chatId, messageContent, {
              parse_mode: "Markdown",
              reply_to_message_id: messageId,
            });
          })
          .catch((err) => {
            console.log(err);
            bot.sendMessage(chatId, "Từ từ thôi nào =))", {
              reply_to_message_id: messageId,
            });
            // var url = ;
          });
      }

      if (text.startsWith("/hourweather")) {
        console.log("Username:" + msg.from.username + "\n");
        console.log(
          "Fullname:" + msg.from.first_name + " " + msg.from.last_name + "\n"
        );
        console.log("Text:" + msg.text + "\n");
        if (msg.chat.type === "supergroup") {
          console.log("Group Id:" + msg.chat.id + "\n");
          console.log("Group Name:" + msg.chat.title + "\n");
        }
        weather
          .getHoursly()
          .then((response) => {
            var data = response;
            var currentTime = data.current.dt;
            var arr = [];
            var limit = 8;
            var start = 1;
            data.hourly.forEach((hour) => {
              if (hour.dt > currentTime) {
                if (start < limit) {
                  arr.push(hour);
                  start++;
                }
              }
            });
            arr.sort((a, b) => {
              return a.dt - b.dt;
            });
            var content = "* Thời tiết tại BKASOFT* \n \n";
            arr.forEach((hour) => {
              if (hour.dt > currentTime) {
                var messageContent =
                  "* Thời gian: " + unixTime.timeConverter(hour.dt) + "* \n";
                messageContent +=
                  "- Trạng thái: " + hour.weather[0].description + "\n";
                messageContent +=
                  "- Nhiệt độ: " +
                  hour.temp +
                  " °C cảm giác như " +
                  hour.feels_like +
                  " °C \n";
                messageContent += "- Mây: " + hour.clouds + " % \n";
                content += messageContent + "\n";
              }
            });
            bot.sendMessage(chatId, content, {
              parse_mode: "Markdown",
              reply_to_message_id: messageId,
            });
          })
          .catch((err) => {
            console.log(err);
            bot.sendMessage(chatId, "Từ từ thôi nào =))", {
              reply_to_message_id: messageId,
            });
            // var url = ;
          });
      }

      if (text.startsWith("/trending")) {
        console.log("Username:" + msg.from.username + "\n");
        console.log(
          "Fullname:" + msg.from.first_name + " " + msg.from.last_name + "\n"
        );
        console.log("Text:" + msg.text + "\n");
        if (msg.chat.type === "supergroup") {
          console.log("Group Id:" + msg.chat.id + "\n");
          console.log("Group Name:" + msg.chat.title + "\n");
        }
        bot.sendMessage(chatId, "Đợi Xíu =))");
        getTikTok
          .getTrending()
          .then((response) => {
            var data =
              response.data[Math.floor(Math.random() * response.data.length)];
            var title = data.title;
            if (data.hdplay != null) {
              data = data.hdplay;
            } else {
              data = data.wmplay;
            }
            bot.sendMessage(chatId, title, {
              reply_to_message_id: messageId,
            });
            bot.sendVideo(chatId, data, {
              reply_to_message_id: messageId,
            });
          })
          .catch((err) => {
            console.log(err);
            bot.sendMessage(chatId, "Từ từ thôi nào =))", {
              reply_to_message_id: messageId,
            });
            // var url = ;
          });
      }
      if (text.startsWith("/search")) {
        console.log("Username:" + msg.from.username + "\n");
        console.log(
          "Fullname:" + msg.from.first_name + " " + msg.from.last_name + "\n"
        );
        console.log("Text:" + msg.text + "\n");
        if (msg.chat.type === "supergroup") {
          console.log("Group Id:" + msg.chat.id + "\n");
          console.log("Group Name:" + msg.chat.title + "\n");
        }
        bot.sendMessage(chatId, "Đợi Xíu =))");
        var keyword = msg.text.replace("/search", "");
        getTikTok
          .searchVideo(keyword)
          .then((response) => {
            if (response.data.videos) {
              var data =
                response.data.videos[
                  Math.floor(Math.random() * response.data.videos.length)
                ];
              var title = data.title;
              if (data.hdplay != null) {
                data = data.hdplay;
              } else {
                data = data.wmplay;
              }
              bot.sendMessage(chatId, title, {
                reply_to_message_id: messageId,
              });
              bot.sendVideo(chatId, data, {
                reply_to_message_id: messageId,
              });
            } else {
              bot.sendMessage(chatId, "Không tìm thấy kết quả", {
                reply_to_message_id: messageId,
              });
            }
          })
          .catch((err) => {
            console.log(err);
            bot.sendMessage(chatId, "Từ từ thôi nào =))", {
              reply_to_message_id: messageId,
            });
            // var url = ;
          });
      }

      if (text.startsWith("/help")) {
        console.log("Username:" + msg.from.username + "\n");
        console.log(
          "Fullname:" + msg.from.first_name + " " + msg.from.last_name + "\n"
        );
        console.log("Text:" + msg.text + "\n");
        if (msg.chat.type === "supergroup") {
          console.log("Group Id:" + msg.chat.id + "\n");
          console.log("Group Name:" + msg.chat.title + "\n");
        }
        var messageContent = "*Danh sách các lệnhh:* \n";
        messageContent += "- /xinh : Xem ảnh gái xinh đẹp mlem mlem \n";
        messageContent += "- /angi : Chọn xem hôm nay sẽ ăn gì \n";
        messageContent += "- /covid : Thông tin covid-19 Hà Nội và Việt Nam\n";
        bot.sendMessage(chatId, messageContent, {
          parse_mode: "Markdown",
          reply_to_message_id: messageId,
        });
      }
      if (text.startsWith("/xinh")) {
        console.log("Username:" + msg.from.username + "\n");
        console.log(
          "Fullname:" + msg.from.first_name + " " + msg.from.last_name + "\n"
        );
        console.log("Text:" + msg.text + "\n");
        if (msg.chat.type === "supergroup") {
          console.log("Group Id:" + msg.chat.id + "\n");
          console.log("Group Name:" + msg.chat.title + "\n");
        }
        data
          .data()
          .then((response) => {
            var obj = Array.isArray(response) ? response[0] : response;
            var srcImg = obj["photo-url-1280"];
            var caption = obj["photo-caption"];
            bot.sendPhoto(chatId, srcImg ?? "1", {
              parse_mode: "Markdown",
              reply_to_message_id: messageId,
            });

            // if(caption != ""){
            //   var result = convert(caption);
            //   result =  result.replace("https://facebook.com/gaixinhchonloc",'');
            //   result =  result.replace("#gaixinhchonloc",'');
            // bot.sendMessage(chatId, result);
            // }
          })
          .catch((err) => {
            bot.sendMessage(chatId, err ?? "1");
          });
      }
      if (text.startsWith("/gitlab")) {
        var messageContent = "Copy URL ở dưới đây: \n\n";
        messageContent +=
          "``` https://bot.huuhieu.name.vn/webhook/" + msg.chat.id + "```";
        bot.sendMessage(chatId, messageContent, {
          parse_mode: "Markdown",
          reply_to_message_id: messageId,
        });
      }
      if (text.startsWith("/covid")) {
        console.log("Username:" + msg.from.username + "\n");
        console.log(
          "Fullname:" + msg.from.first_name + " " + msg.from.last_name + "\n"
        );
        console.log("Text:" + msg.text + "\n");
        if (msg.chat.type === "supergroup") {
          console.log("Group Id:" + msg.chat.id + "\n");
          console.log("Group Name:" + msg.chat.title + "\n");
        }
        // Write Javascript code here
        covid
          .covid()
          .then((response) => {
            var today = new Date();
            var date =
              today.getDate() +
              "-" +
              (today.getMonth() + 1) +
              "-" +
              today.getFullYear();
            var arr = response;
            var messageContent = "*Thông tin covid 19 (" + date + ")* \n";
            messageContent += "Hà Nội: \n";
            messageContent += "- Số ca hôm nay: " + arr.hanoi.casesToday + "\n";
            messageContent += "- Tổng số ca: " + arr.hanoi.cases + "\n";
            messageContent += "- Tử vong: " + arr.hanoi.death + "\n";
            messageContent += "Cả nước: \n";
            messageContent += "- Tổng số ca: " + arr.canuoc.cases + "\n";
            messageContent += "- Tử vong: " + arr.canuoc.death + "\n";
            messageContent += "- Đang điều trị: " + arr.canuoc.treating + "\n";
            messageContent += "- Phục hồi: " + arr.canuoc.recovered + "\n";
            bot.sendMessage(chatId, messageContent, {
              parse_mode: "Markdown",
              reply_to_message_id: messageId,
            });
          })
          .catch((err) => {
            console.log(err);
            bot.sendMessage(chatId, "Lỗi");
          });
      }
      if (text.startsWith("/khen")) {
        console.log("Username:" + msg.from.username + "\n");
        console.log(
          "Fullname:" +
            (msg.from.first_name == null ? "" : msg.from.first_name) +
            " " +
            (msg.from.last_name == null ? "" : msg.from.last_name) +
            "\n"
        );
        console.log("Text:" + msg.text + "\n");
        if (msg.chat.type === "supergroup") {
          console.log("Group Id:" + msg.chat.id + "\n");
          console.log("Group Name:" + msg.chat.title + "\n");
        }
        var loikhen = [
          " xinh đẹp vcl",
          " là 1 con bóng chính hiệu",
          " , bạn là tiên nữ giáng trần",
          " dễ thương quá, cho nựng cái",
          " là người con gái đẹp nhất tôi từng gặp",
          " thật mạnh mẽ",
          " là con bóng gồng",
          " -> chúa tể bê đê",
          " gì cũng biết, gì cũng hay",
          " là nhất, là số một",
        ];
        var name =
          msg.from.first_name +
          " " +
          msg.from.last_name +
          loikhen[~~(Math.random() * loikhen.length)];
        bot.sendMessage(chatId, name, {
          reply_to_message_id: messageId,
          protect_content: name,
        });
      }
    }
  });
};
const gitLabMessage = (result, id) => {
  var messageContent = "";
  switch (result?.type) {
    case "push":
      if (result?.sha?.before == "0000000000000000000000000000000000000000") {
        messageContent += `*${result?.user?.name}\* đã tạo nhánh [${
          result?.project?.namespace
        }/${result?.project?.name}/${getBranchName(result?.ref)}](${
          result?.project?.urls?.repository
        }) \n`;
        if (result?.commits?.length > 0) {
          messageContent += `*${result?.user?.name}\* đã push to [${
            result?.project?.namespace
          }/${result?.project?.name}/${getBranchName(result?.ref)}](${
            result?.project?.urls?.repository
          }) \n`;
          result?.commits?.forEach((commit) => {
            messageContent += `\t-   ${commit?.author?.name} : [${commit?.message}](${commit?.url}) \n`;
            if (
              commit?.files?.added?.length > 0 ||
              commit?.files?.modified?.length > 0 ||
              commit?.files?.removed?.length > 0
            ) {
              messageContent += `\t`;
              messageContent += `(`;
              if (commit?.files?.added?.length > 0) {
                console.log(commit?.files?.added?.length);
                messageContent += ` ${commit?.files?.added?.length} files added`;
              }
              if (commit?.files?.modified?.length > 0) {
                console.log(commit?.files?.modified?.length);
                messageContent += ` ${commit?.files?.modified?.length} files modified`;
              }
              if (commit?.files?.removed?.length > 0) {
                console.log(commit?.files?.removed?.length);
                messageContent += ` ${commit?.files?.removed?.length} files removed`;
              }
              messageContent += `) \n\n`;
            }
          });
        }
      } else if (
        result?.sha?.after == "0000000000000000000000000000000000000000"
      ) {
        messageContent += `*${result?.user?.name}\* đã xoá nhánh  ${
          result?.project?.namespace
        }/${result?.project?.name}/${getBranchName(result?.ref)} \n`;
      } else {
        messageContent += `*${result?.user?.name}\* đã push to [${
          result?.project?.namespace
        }/${result?.project?.name}/${getBranchName(result?.ref)}](${
          result?.project?.urls?.repository
        }) \n`;
        result?.commits?.forEach((commit) => {
          messageContent += `\t-   ${commit?.author?.name} : [${commit?.message}](${commit?.url}) \n`;
          if (
            commit?.files?.added?.length > 0 ||
            commit?.files?.modified?.length > 0 ||
            commit?.files?.removed?.length > 0
          ) {
            messageContent += `\t`;
            messageContent += `(`;
            if (commit?.files?.added?.length > 0) {
              console.log(commit?.files?.added?.length);
              messageContent += ` ${commit?.files?.added?.length} files added`;
            }
            if (commit?.files?.modified?.length > 0) {
              console.log(commit?.files?.modified?.length);
              messageContent += ` ${commit?.files?.modified?.length} files modified`;
            }
            if (commit?.files?.removed?.length > 0) {
              console.log(commit?.files?.removed?.length);
              messageContent += ` ${commit?.files?.removed?.length} files removed`;
            }
            messageContent += `) \n\n`;
          }
        });
      }
      if (messageContent === "") {
        return;
      }
      bot.sendMessage(id, messageContent, {
        parse_mode: "Markdown",
      });
      break;
    case "pipeline":
      console.log("result:", result);
      if (result?.status === "running") {
        messageContent += `\n⚙️ Pipeline is running ⌛!! \n`;
        messageContent += `\n\n📄 \t  [${result?.project?.namespace}/${
          result?.project?.name
        }/${getBranchName(result?.ref)}](${result?.project?.urls?.repository})`;
        messageContent += `\n\n🔗 \t  [${result?.project?.urls?.repository}/-/pipelines/${result?.id}](${result?.project?.urls?.repository}/-/pipelines/${result?.id})`;
        messageContent += `\n\n📄 \t  *** ${result?.commit?.author?.name} : \*\*\* [${result?.commit?.message}](${result?.commit?.url}) `;
      }
      if (result?.status === "failed") {
        messageContent += `\n⚙️ Build failed 🆘!! \n`;
        messageContent += `\n\n📄 \t  [${result?.project?.namespace}/${
          result?.project?.name
        }/${getBranchName(result?.ref)}](${result?.project?.urls?.repository})`;
        messageContent += `\n\n🔗 \t  [${result?.project?.urls?.repository}/-/pipelines/${result?.id}](${result?.project?.urls?.repository}/-/pipelines/${result?.id})`;
        messageContent += `\n\n📄 \t  *** ${result?.commit?.author?.name} : \*\*\* [${result?.commit?.message}](${result?.commit?.url}) `;
      }
      if (result?.status === "error") {
        messageContent += `\n⚙️ Build failed 🆘!! \n`;
        messageContent += `\n\n📄 \t  [${result?.project?.namespace}/${
          result?.project?.name
        }/${getBranchName(result?.ref)}](${result?.project?.urls?.repository})`;
        messageContent += `\n\n🔗 \t  [${result?.project?.urls?.repository}/-/pipelines/${result?.id}](${result?.project?.urls?.repository}/-/pipelines/${result?.id})`;
        messageContent += `\n\n📄 \t  *** ${result?.commit?.author?.name} : \*\*\* [${result?.commit?.message}](${result?.commit?.url}) `;
      }
      if (result?.status === "canceled") {
        messageContent += `\n⚙️ Canceled by *** ${result?.user?.name} \*\*\*❌!! \n`;
        messageContent += `\n\n📄 \t  [${result?.project?.namespace}/${
          result?.project?.name
        }/${getBranchName(result?.ref)}](${result?.project?.urls?.repository})`;
        messageContent += `\n\n🔗 \t  [${result?.project?.urls?.repository}/-/pipelines/${result?.id}](${result?.project?.urls?.repository}/-/pipelines/${result?.id})`;
      }
      if (result?.status === "success") {
        messageContent += `\n⚙️ Build thành công ✅!! \n`;
        messageContent += `\n\n📄 \t  [${result?.project?.namespace}/${
          result?.project?.name
        }/${getBranchName(result?.ref)}](${result?.project?.urls?.repository})`;
        messageContent += `\n\n🔗 \t  [${result?.project?.urls?.repository}/-/pipelines/${result?.id}](${result?.project?.urls?.repository}/-/pipelines/${result?.id})`;
        messageContent += `\n\n📄 \t  *** ${result?.commit?.author?.name} : \*\*\* [${result?.commit?.message}](${result?.commit?.url}) `;
      }
      if (messageContent === "") {
        return;
      }
      bot.sendMessage(id, messageContent, {
        parse_mode: "Markdown",
      });
    default:
      break;
  }
};
module.exports = {
  Telegram,
  gitLabMessage,
};
