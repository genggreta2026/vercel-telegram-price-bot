
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { webHook: true });
const app = express();
app.use(express.json());

app.get('/', (req, res) => res.json({ status: 'kai-price-bot ok' }));
app.post(`/${token}`, express.raw({type: 'application/json'}), (req, res) => {
    bot.processUpdate(JSON.parse(req.body));
    res.sendStatus(200);
});

app.listen(process.env.PORT || 3000);

// 你的推广Bot功能
bot.onText(/\/price (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const symbol = match.toUpperCase();
    try {
        await bot.sendMessage(chatId, `⏳ 查询 ${symbol} 价格...`);
        const res = await axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}USDT`);
        const price = parseFloat(res.data.price);
        await bot.sendMessage(chatId, 
            `💰 ${symbol}/USDT: **$${price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}**\n\n` +
            `[📈 Trade Now（立即交易）](https://kai.com/register?inviteCode=G6D7B9)\n` +
            `[😇 Ecological Partner（成为合伙人）](https://kai.com/kai-ambassador.html)\n` +
            `[👸 C2C Merchant（成为C2C商家）](https://kai.com/register?inviteCode=G6D7B9)\n`,
            { parse_mode: 'Markdown' }
        );
    } catch (error) {
        await bot.sendMessage(chatId, "❌ 查询失败，请稍后重试");
    }
});

module.exports = app;
