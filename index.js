
const http = require('http');
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
app.listen(process.env.PORT || 3000);

app.get(webHookEndPoint, (req, res) => {
  const {url} = req;
  console.log("Received Webhook Request");
  console.log("Full url:" + url)
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
})

app.delete(webHookEndPoint,(req,res) => {
  const {url} = req;
  console.log("Received Webhook DELETE Request");
  console.log("Url:");
  console.log(url);
})

// gitlab webhook
app.post("/webhook/:id", async (req,res) => {
  const {id} = req.params;
  const {body} = req;
  console.log(body)
  let result = gitlab.transformGitLabEvent(body);
  console.log(result);
  result?.commits.forEach(element => {
      console.log(element.author);
      console.log(element.files);
  });
  Telegram.gitLabMessage(result,id);
})
// wakeup bot
setInterval(function () {
  http.get("http://gaixinhbot.herokuapp.com");
}, 3000); // every 5 minutes (300000)

Telegram.Telegram();
    

