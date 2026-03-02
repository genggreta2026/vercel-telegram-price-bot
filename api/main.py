
from flask import Flask, request
import os
import requests
import json
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes

app = Flask(__name__)

# Bot Token（Vercel环境变量）
TOKEN = os.getenv('BOT_TOKEN')

@app.route('/', methods=['POST'])
def webhook():
    try:
        update = request.get_json()
        
        # 简单价格查询示例
        if '/price' in update['message']['text']:
            chat_id = update['message']['chat']['id']
            send_price_response(chat_id)
            return 'OK'
        
        # 其他消息回复
        chat_id = update['message']['chat']['id']
        app.send_message(chat_id, '发送 /price 查询价格！')
        
    except Exception as e:
        print(f"Error: {e}")
    return 'OK'

def send_price_response(chat_id):
    """模拟价格API响应"""
    price_data = {
        "BTC": "$43,250",
        "ETH": "$2,580",
        "SOL": "$98.50"
    }
    
    message = "📊 **实时行情**\n\n"
    for coin, price in price_data.items():
        message += f"-  {coin}: {price}\n"
    
    # 发送消息到Telegram
    url = f"https://api.telegram.org/bot{TOKEN}/sendMessage"
    data = {
        "chat_id": chat_id,
        "text": message,
        "parse_mode": "Markdown"
    }
    requests.post(url, json=data)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))

