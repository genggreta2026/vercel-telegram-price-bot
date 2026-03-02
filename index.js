import express from 'express';
import TelegramBot from 'node-telegram-bot-api';
import axios from 'axios';

const token = process.env.BOT_TOKEN;
if (!token) throw new Error('❌ 请设置 BOT_TOKEN 环境变量');

const bot = new TelegramBot(token, { webHook: true });
const app = express();
app.use(express.json());

app.get('/', (req, res) => res.json({ status: 'kai-price-bot ok' }));

app.post(`/${token}`, express.raw({type: 'application/json'}), (req, res) => {
    bot.processUpdate(JSON.parse(req.body));
    res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 KAI价格Bot运行在端口 ${PORT}`));

// ===== 你的个性化功能（完全保留）=====
bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    await bot.sendMessage(chatId, 
        "🚀 行情 Bot 已启动！\n" +
        "📊 /price BTC - 查询比特币价格\n" +
        "📊 /price ETH - 查询以太坊价格"
    );
});

async function getPrice(symbol) {
    const response = await axios.get(
        `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}USDT`,
        { timeout: 5000 }
    );
    return parseFloat(response.data.price);
}

bot.onText(/\/price (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const symbol = match[1].toUpperCase();
    
    try {
        await bot.sendMessage(chatId, `⏳ 查询 ${symbol} 价格...`);
        const price = await getPrice(symbol);
        
        await bot.sendMessage(chatId, 
            `💰 ${symbol}/USDT: **$${price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}**\n\n` +
            `[📈 Trade Now（立即交易）](https://kai.com/register?inviteCode=G6D7B9)\n` +
            `[😇 Ecological Partner（成为合伙人）](https://kai.com/kai-ambassador.html)\n` +
            `[👸 C2C Merchant（成为C2C商家）](https://kai.com/register?inviteCode=G6D7B9)\n`,
            { parse_mode: 'Markdown', disable_web_page_preview: true }
        );
    } catch (error) {
        await bot.sendMessage(chatId, "❌ 查询失败，请稍后重试");
    }
});

export default app;
