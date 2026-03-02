
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const token = process.env.BOT_TOKEN;
if (!token) {
    console.error('❌ 请设置 BOT_TOKEN');
    process.exit(1);
}

const app = express();
app.use(express.json());
app.use(express.raw({type: 'application/json'}));

const bot = new TelegramBot(token, { webHook: true });

// 健康检查
app.get('/', (req, res) => res.json({ status: 'kai-price-bot ok' }));

// Telegram Webhook
app.post('/', (req, res) => {
    bot.processUpdate(JSON.parse(req.body));
    res.sendStatus(200);
});

bot.onText(/\/start/, async (msg) => {
    await bot.sendMessage(msg.chat.id, 
        "🚀 行情
