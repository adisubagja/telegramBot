
const https = require('https');
const express = require('express');
const db = require('./asset/db');
const app = express();
const bodyParser = require('body-parser');
const Telegram = require('./bot');
const gitlab = require('./modules/gitlab');
const { response } = require('express');
const webHookEndPoint = "/webhook";
// module
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
app.get('/', function (req, res) {
  res.send('Developed by Hữu Hiếu')
})
app.get('/list-group', db.getListGroup);
app.post('/add-group', db.addGroup);
app.listen(process.env.PORT || 3002);

app.get(webHookEndPoint, (req, res) => {
  const {url} = req;
  console.log("Received Webhook Request");
  console.log("Full url:" + url)
  res.send("OK")
})

app.post(webHookEndPoint,(req,res) => {
  const {body} = req;
  console.log("Received Webhook POST Request");
  console.log("Request body:");
  console.log(body);
})

app.put(webHookEndPoint,(req,res) => {
  const {body} = req;
  console.log("Received Webhook PUT Request");
  console.log("Request body:");
  console.log(body);
  res.send("OK")
})

app.delete(webHookEndPoint,(req,res) => {
  const {url} = req;
  console.log("Received Webhook DELETE Request");
  console.log("Url:");
  console.log(url);
  res.send("OK")
})

// gitlab webhook
app.post("/webhook/:id", async (req,res) => {
  const {id} = req.params;
  const {body} = req;
  let result = gitlab.transformGitLabEvent(body);
  Telegram.gitLabMessage(result,id);
  res.send("ok")
})
// wakeup bot
setInterval(function () {
  https.get("https://bot.huuhieu.name.vn");
}, 900000); 
Telegram.Telegram();
    

