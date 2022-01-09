require('dotenv').config();
const http = require('http');

const env = process.env;
var CronJob = require('cron').CronJob;
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const token = env.TELEGRAM_TOKEN || "token";
const bot = new TelegramBot(token, { polling: true });
const db = require('../asset/db');
const covid = require('../modules/covid19');
const getListGroup = require('../modules/getAllGroup');


var today = new Date();
console.log("sendMessage");
var date = today.getDate() + '\-' + (today.getMonth() + 1) + '\-' + today.getFullYear();
getListGroup.getListGroup().then(response => {
    var obj = JSON.parse(response);
    obj.forEach(function (item, index) {
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
            bot.sendMessage(item.groupid, messageContent, {
                parse_mode: "Markdown"
            });
process.exit(0);

        }).catch(err => {
            console.log(err);
            bot.sendMessage(item.groupid, "Lỗi");
        })
    });
})
