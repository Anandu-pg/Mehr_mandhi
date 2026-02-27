import requests

# ====== CONFIG ======
BOT_TOKEN = "8601471502:AAE-qsVwqmxwWjcmKRi_mBbpjCUyoJL6Rz8"
CHAT_ID = "-1003862093892"   # Your Supergroup ID

# ====== MESSAGE ======
message = "test"

# ====== API URL ======
url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"

payload = {
    "chat_id": CHAT_ID,
    "text": message
}

response = requests.post(url, data=payload)

print(response.json())