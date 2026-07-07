---
title: "Telegram Bot 机器人入门教程：从创建到部署"
description: "Telegram Bot 机器人零基础开发教程。通过 @BotFather 创建机器人、Bot API 基础概念、Webhook 与 Polling 模式对比、内联模式与键盘菜单配置、实用机器人推荐，以及 Python 和 Node.js 示例代码。"
keywords: "Telegram,Telegram Bot,机器人教程,BotFather,Bot API,Webhook,Polling,内联模式,机器人开发,Python Telegram Bot"
date: 2026-07-07
lastmod: 2026-07-07
category: "tutorial"
tags: ["机器人", "Bot开发", "API教程", "自动化"]
coverImage: "/images/default-cover.jpg"
draft: false
---

你可能每天都在 Telegram 群里看到机器人发通知、验证新成员、推送 RSS 订阅——但你有没有想过自己写一个？哪怕你只会最基础的编程，半小时就能上线一个 Telegram 机器人。

这篇文章从 @BotFather 注册讲到 Python 代码实战，目标是让你看完之后能自己跑起来一个 Bot。

## 什么是 Telegram Bot


<img src="/images/posts/telegram-bot-creat-guide-1.jpg" alt="BotFather创建机器人界面" style="width:100%; border-radius:8px; margin:24px 0;">
Telegram Bot 本质上是一个运行在服务器上的程序，通过 Telegram 的 Bot API 接收和发送消息。用户和 Bot 聊天时，消息不是直接发给了某个真人，而是发到了 Telegram 的服务器，服务器再转发给你写的程序，程序处理后再通过 API 回复用户。

Bot 能做：
- 自动回复消息
- 推送通知（RSS 订阅、价格提醒、服务器告警）
- 入群验证（新人加群做 CAPTCHA）
- 文件处理（图片压缩、格式转换）
- 游戏交互（猜谜、答题）
- 支付收款（Telegram 支持 Bot 内置支付）

## 第一步：用 @BotFather 创建机器人

@BotFather 是所有 Telegram Bot 的总控制器。你要创建、修改、删除 Bot，都通过它操作。

### 创建流程

1. 在 Telegram 搜索 `@BotFather`，点击 Start 开始对话
2. 发送命令 `/newbot`
3. @BotFather 会问机器人名称（显示名称，可以中文，如"我的测试机器人"）
4. 输入显示名称后，@BotFather 会让你设置机器人的用户名（必须以 `bot` 结尾，如 `my_test_123_bot`）
5. 设置成功后，@BotFather 会返回一条消息，其中包含最重要的东西：

```
Done! Congratulations on your new bot.
...
Use this token to access the HTTP API:
1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
Keep your token secure and store it safely.
```

这个 Token 就是你的机器人的"密码"。有了它，你的程序就能控制这个 Bot。

<div class="warn-box">
<strong>绝对不要泄露 Bot Token！</strong>任何人拿到这个 Token 都可以完全控制你的机器人——发送消息、踢出群成员、修改 Bot 设置。不要把 Token 贴到 GitHub 上，不要截图发给别人。如果不小心泄露了，立即用 @BotFather 的 <code>/revoke</code> 命令重置。
</div>

### @BotFather 常用命令

| 命令 | 功能 |
|------|------|
| `/newbot` | 创建新 Bot |
| `/mybots` | 列出和管理你的所有 Bot |
| `/setname` | 修改 Bot 显示名称 |
| `/setdescription` | 修改 Bot 描述（用户点 Start 时显示） |
| `/setabouttext` | 修改 Bot 简介（Bot 资料页显示） |
| `/setuserpic` | 修改 Bot 头像 |
| `/setcommands` | 设置命令列表 |
| `/setjoingroups` | 允许/禁止 Bot 被拉入群组 |
| `/setinline` | 开启内联模式 |
| `/revoke` | 重置 Token |
| `/deletebot` | 删除 Bot |

做完这些基础配置后，你的 Bot 已经有了名称、头像和描述，但它现在什么都不会做——因为你还没有给它写"大脑"（程序）。

## Bot API 基础概念

### 消息获取的两种模式

程序要接收用户发给 Bot 的消息，有两种方式：

**Polling（轮询/长轮询）：**
你的程序定期去 Telegram 服务器问："有没有新消息？" 如果有，就拿回来处理。优点是实现简单、不需要公网域名；缺点是需要持续运行一个进程。

**Webhook（回调）：**
你的程序提供一个 HTTPS 公网地址。每当用户给 Bot 发消息，Telegram 服务器主动把你的地址（POST 请求带消息数据）。优点是实时、省资源；缺点是需要一个公网可访问的 HTTPS 服务器。

| | Polling | Webhook |
|---|---|---|
| 部署难度 | 低，本地可运行 | 高，需要 HTTPS 公网域名 |
| 实时性 | 稍有延迟（取决于轮询间隔） | 近乎实时 |
| 资源消耗 | 持续占用进程 | 按请求消耗 |
| 适合场景 | 开发测试、个人 Bot | 生产环境、高并发 Bot |

### API 请求格式

Telegram Bot API 的请求格式非常简洁：

```
https://api.telegram.org/bot<TOKEN>/<METHOD>
```

例如，用 `getMe` 方法获取 Bot 信息：

```
GET https://api.telegram.org/bot1234567890:ABCdefGHIjklMNOpqrsTUVwxyz/getMe
```

返回的 JSON：

```json
{
  "ok": true,
  "result": {
    "id": 1234567890,
    "is_bot": true,
    "first_name": "我的测试机器人",
    "username": "my_test_123_bot"
  }
}
```

### 常用 API 方法

| 方法 | 功能 |
|------|------|
| `getMe` | 获取 Bot 基本信息 |
| `getUpdates` | 获取待处理的消息（Polling 用） |
| `sendMessage` | 发送文本消息 |
| `sendPhoto` | 发送图片 |
| `sendDocument` | 发送文件 |
| `forwardMessage` | 转发消息 |
| `deleteMessage` | 删除消息 |
| `sendPoll` | 发送投票 |
| `setWebhook` | 设置 Webhook 地址 |
| `deleteWebhook` | 清除 Webhook 配置 |

完整的 API 文档在 Telegram 官网上有非常详细的说明，40 多个方法覆盖了消息、媒体、支付、游戏等各种场景。

## 实战：Python 编写 Echo Bot

我们先写一个最简单的"回声机器人"——你说什么，它就重复什么。用 Python 和 `python-telegram-bot` 库。

### 安装依赖

```bash
pip install python-telegram-bot
```

### 完整代码

```python
import logging
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes

# 开启日志
logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# 替换为你的 Bot Token
BOT_TOKEN = "你的Token"

# /start 命令处理
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    await update.message.reply_text(
        f"你好 {user.first_name}！我是回声机器人。\n"
        f"发送任何消息，我都会原样回复你。\n"
        f"使用 /help 查看帮助。"
    )

# /help 命令处理
async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "可用命令：\n"
        "/start - 开始对话\n"
        "/help - 查看帮助\n"
        "/about - 关于我"
    )

# /about 命令处理
async def about(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "我是一个用 python-telegram-bot 库写的示例机器人。"
    )

# 文本消息回声
async def echo(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_text = update.message.text
    await update.message.reply_text(f"你说：{user_text}")

# 非文本消息处理
async def non_text(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("收到了非文本消息（图片/文件/贴纸等），但我只会回文字。")

def main():
    # 创建 Application
    app = Application.builder().token(BOT_TOKEN).build()

    # 注册命令处理器
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("help", help_command))
    app.add_handler(CommandHandler("about", about))

    # 注册消息处理器（注意顺序：命令处理在前，通用处理在后）
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, echo))
    app.add_handler(MessageHandler(~filters.TEXT, non_text))

    # 开始 Polling
    logger.info("Bot 启动中...")
    app.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == "__main__":
    main()
```

### 运行

```bash
python echo_bot.py
```

程序运行后，在 Telegram 中给你的 Bot 发消息，它会立即回复。这个例子用的是 Polling 模式，程序跑在你的本地电脑上就能工作。

### 代码拆解

- `Application.builder().token(BOT_TOKEN).build()` 创建 Bot 实例
- `CommandHandler("start", start)` 注册 `/start` 命令的处理器
- `MessageHandler(filters.TEXT, echo)` 匹配文本消息
- `app.run_polling()` 开始长轮询

`python-telegram-bot` 是最流行的 Python Telegram Bot 框架，封装了所有 API 细节，推荐新手使用。

## 实战：Node.js 编写 Echo Bot

如果你用 Node.js 生态，可以用 `node-telegram-bot-api` 库。

### 安装

```bash
npm install node-telegram-bot-api
```

### 完整代码

```javascript
const TelegramBot = require('node-telegram-bot-api');

const TOKEN = '你的Token';

// 创建 Bot 实例，使用 Polling
const bot = new TelegramBot(TOKEN, { polling: true });

// /start 命令
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, `你好 ${msg.from.first_name}！我是用 Node.js 写的回声机器人。`);
});

// /help 命令
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, '可用命令：\n/start - 开始对话\n/help - 查看帮助');
});

// 文本回声
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  // 忽略命令
  if (msg.text && !msg.text.startsWith('/')) {
    bot.sendMessage(chatId, `你说：${msg.text}`);
  }
});

console.log('Bot 启动中...');
```

<div class="info-box">
<strong>对比：</strong>Node.js 版本代码更简短，但 Python 的 <code>python-telegram-bot</code> 框架功能更完善（支持中间件、对话流程、JobQueue 定时任务等）。如果你要写复杂 Bot，推荐 Python；如果只是简单自动化，Node.js 足够。
</div>

## 内联模式（Inline Mode）

内联模式是 Telegram Bot 的一个独特功能：用户在任何聊天中输入 `@你的Bot名 关键词`，就能调用你的 Bot 并获得结果，而不需要进入 Bot 的私聊。

### 开启内联模式

和 @BotFather 对话：`/setinline` → 选择你的 Bot → 输入提示文字（如"输入关键词搜索"）→ 完成。

### 内联模式的典型用途

- **@gif**：输入 `@gif cat`，在聊天中直接搜索和发送 GIF
- **@wiki**：输入 `@wiki Telegram`，快速查询 Wikipedia 条目
- **@imdb**：输入 `@imdb Inception`，查找电影信息
- **@youtube**：搜索和发送 YouTube 视频

### Python 内联查询示例

```python
from telegram import InlineQueryResultArticle, InputTextMessageContent
from telegram.ext import InlineQueryHandler

async def inline_query(update, context):
    query = update.inline_query.query
    if not query:
        return

    results = [
        InlineQueryResultArticle(
            id="1",
            title=f"搜索：{query}",
            input_message_content=InputTextMessageContent(
                f"你搜索了「{query}」，这是结果。"
            ),
            description="点击发送这条消息"
        )
    ]

    await update.inline_query.answer(results)

# 注册处理器
app.add_handler(InlineQueryHandler(inline_query))
```

用户在任何聊天输入 `@你的Bot 你好` 后，系统会显示你定义的结果卡片，点击即可发送。

## 键盘菜单

Bot 可以定制两种键盘，替代纯文本输入，大大提升交互体验。

### 自定义键盘（ReplyKeyboardMarkup）

显示在输入框上方的按钮，像快捷回复一样。

```python
from telegram import ReplyKeyboardMarkup

async def start(update, context):
    keyboard = [
        ["📰 最新消息", "📅 每日推送"],
        ["ℹ️ 关于我们", "🆘 帮助"],
    ]
    reply_markup = ReplyKeyboardMarkup(
        keyboard,
        resize_keyboard=True,  # 自动调整大小
        one_time_keyboard=False  # 持久显示
    )
    await update.message.reply_text(
        "请选择一个功能：",
        reply_markup=reply_markup
    )
```

### 内联键盘（InlineKeyboardMarkup）

显示在消息下方的按钮，点击后向 Bot 发送回调数据。

```python
from telegram import InlineKeyboardButton, InlineKeyboardMarkup

async def menu(update, context):
    keyboard = [
        [
            InlineKeyboardButton("选项 A", callback_data="option_a"),
            InlineKeyboardButton("选项 B", callback_data="option_b"),
        ],
        [InlineKeyboardButton("🌐 打开网站", url="https://tgxiazai.com")],
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    await update.message.reply_text("请选择：", reply_markup=reply_markup)
```

### 两种键盘对比

| | 自定义键盘 | 内联键盘 |
|---|---|---|
| 位置 | 输入框上方 | 消息下方 |
| 交互 | 发送预设文字 | 触发回调/打开链接 |
| 持久性 | 始终显示直到手动关闭 | 仅在当前消息下 |
| 适合场景 | 快捷菜单、功能导航 | 投票、确认、链接跳转 |

## Webhook 部署

当你的 Bot 需要在生产环境 24 小时运行时，Polling 不太合适。Webhook 是更好的选择。

### 使用 Flask 部署 Python Bot（Webhook 模式）

```python
from flask import Flask, request
import telegram

TOKEN = "你的Token"
bot = telegram.Bot(token=TOKEN)

app = Flask(__name__)

@app.route(f"/{TOKEN}", methods=["POST"])
def webhook():
    update = telegram.Update.de_json(request.get_json(force=True), bot)
    # 处理消息
    if update.message and update.message.text:
        chat_id = update.message.chat.id
        bot.send_message(chat_id=chat_id, text=f"收到：{update.message.text}")
    return "ok"

if __name__ == "__main__":
    # 先设置 Webhook（运行一次即可）
    # bot.set_webhook(url="https://你的域名.com/" + TOKEN)
    app.run(host="0.0.0.0", port=8443)
```

### 部署平台推荐

- **Vercel / Netlify**：免费 Serverless，适合轻量 Bot
- **Railway / Render**：免费额度，适合 Python/Node.js Bot
- **自己的 VPS**：最灵活，也最稳定

## Bot 命令设置

通过 @BotFather 设置命令列表，用户输入 `/` 时会自动提示：

发送 `/setcommands` → 选择 Bot → 输入命令列表：

```
start - 开始使用
help - 查看帮助
menu - 功能菜单
about - 关于本 Bot
settings - 设置
```

## 隐私模式

Telegram Bot 默认启用隐私模式（Privacy Mode）。在隐私模式下：
- Bot 只能收到以 `/` 开头的命令，或以 Bot 用户名为后缀的命令（如 `/start@mybot`）
- Bot 收不到群组中不以它为目标的消息

通过 @BotFather 的 `/setprivacy` 可以切换。如果你需要 Bot 能读取群组中的所有消息（如反垃圾机器人），关闭隐私模式。

如果关闭隐私模式，Bot 需要重新加入已有群组才能生效（权限变更不回溯）。

## 常用机器人推荐

在你自己开发之前，先看看 Telegram 已有的优秀 Bot：

| Bot | 功能 | 用户名 |
|-----|------|--------|
| 贴纸搜索 | 搜索和推荐贴纸包 | @Stickers |
| Gmail 通知 | 新邮件推送到 Telegram | @GmailBot |
| 投票创建 | 群内创建多种投票 | @PollBot |
| RSS 订阅 | 订阅 RSS 推送到频道/私聊 | @TheFeedReaderBot |
| 文件转换 | 图片/文档格式转换 | @newfileconverterbot |
| 翻译 | 内联翻译 | @TranslateFatherBot |
| 天气查询 | 查询全球城市天气 | @weatherman_bot |
| 汇率换算 | 实时汇率查询 | @mycurrencybot |

<div class="info-box">
<strong>交互示范：</strong>和 @GmailBot 聊天，点击 Start，它会引导你授权 Gmail 账户。之后每次收到新邮件，Bot 都会把邮件摘要推送到 Telegram。整个过程不需要写一行代码——这就是 Bot 生态的力量。
</div>

想深入了解 Bot 在群组管理中的应用，可以看 <a href="/tutorial/telegram-group-features-guide/">Telegram 群组功能详解</a>。如果你是 Telegram 新手，先打好基础——看 <a href="/tutorial/telegram-beginner-complete-guide/">Telegram 新手入门完全指南</a>。

## 消息格式化与 Markdown

Bot 发送的消息支持 Markdown 格式和 HTML 格式，让你的回复不再只是干巴巴的文字。

### MarkdownV2 示例

```python
async def formatted_message(update, context):
    text = (
        "*加粗标题*\n"
        "_斜体文字_\n"
        "__下划线__\n"
        "~删除线~\n"
        "||剧透内容||\n"
        "`行内代码`\n"
        "```\n代码块\n```"
    )
    await update.message.reply_text(
        text,
        parse_mode="MarkdownV2"
    )
```

### 注意事项

使用 MarkdownV2 时，所有特殊字符（`. ! ( ) - _ ~` 等）必须用 `\` 转义，否则消息发送会失败。推荐使用 `python-telegram-bot` 提供的 `escape_markdown()` 辅助函数来处理用户输入中的特殊字符。

HTML 格式的语法更宽容，不需要转义：

```python
text = "<b>加粗</b> <i>斜体</i> <u>下划线</u> <code>代码</code>"
await update.message.reply_text(text, parse_mode="HTML")
```

如果你需要发送格式复杂的消息（如新闻摘要），HTML 模式通常比 MarkdownV2 更容易调试。

## Bot 安全最佳实践

一旦你的 Bot 开始服务真实用户，安全问题就是头等大事。

### Token 管理

- 永远不要把 Token 硬编码在源代码中，使用环境变量：
  ```python
  import os
  TOKEN = os.environ.get("BOT_TOKEN")
  ```
- `.gitignore` 中排除 `.env` 文件
- 如果 Token 曾经出现在 Git 历史中，用 @BotFather `/revoke` 重置

### 输入验证

用户发送的任何内容都要做校验，尤其是：
- 作为文件名或系统命令参数的内容（防路径遍历攻击）
- 作为数据库查询的内容（防注入攻击）
- 作为 HTML/Markdown 输出的内容（防格式注入）

### 速率限制

在 Bot 代码中实现速率限制，防止单个用户疯狂调用你的 Bot：

```python
from functools import wraps
import time

user_last_request = {}

def rate_limit(max_per_second=1):
    def decorator(func):
        @wraps(func)
        async def wrapper(update, context, *args, **kwargs):
            user_id = update.effective_user.id
            now = time.time()
            if user_id in user_last_request:
                elapsed = now - user_last_request[user_id]
                if elapsed < 1.0 / max_per_second:
                    return  # 静默忽略
            user_last_request[user_id] = now
            return await func(update, context, *args, **kwargs)
        return wrapper
    return decorator
```

### 最小权限原则

如果使用 @BotFather 设置 Bot 权限时，只开启你的 Bot 真正需要的功能。不需要内联模式？别开。不需要加入群组？关掉。不需要读取群消息？保持隐私模式。每个额外的权限都是潜在的攻击面。

## 进阶学习路径

Bot 开发的上限很高。以下是你练完 Echo Bot 之后可以探索的方向：

1. **对话流程（ConversationHandler）**：构建多步骤对话，如问卷调查、注册流程
2. **JobQueue 定时任务**：每天定时推送新闻、提醒等
3. **数据库集成**：用 SQLite/PostgreSQL 存储用户数据和状态
4. **支付集成**：Telegram 内置支付 API，Bot 可以直接收款
5. **Web App**：在 Telegram 内打开你的网页应用（Telegram Mini App）
6. **游戏开发**：用 HTML5 写 Bot 游戏



<img src="/images/posts/telegram-bot-creat-guide-2.jpg" alt="Telegram Bot功能展示" style="width:100%; border-radius:8px; margin:24px 0;">

## 常见问题 FAQ

<div class="faq-list">
<div class="faq-item">
<div class="faq-q">Q：一个 Telegram 账号可以创建多少个 Bot？<span class="faq-arrow">▼</span></div>
<div class="faq-a"><div class="faq-a-inner">A：每个 Telegram 账号最多创建 20 个 Bot。如果不够用，可以用其他手机号注册新账号再创建。</div></div>
</div>
<div class="faq-item">
<div class="faq-q">Q：Bot 可以主动给用户发消息吗？<span class="faq-arrow">▼</span></div>
<div class="faq-a"><div class="faq-a-inner">A：可以，但有限制。Bot 可以主动向曾经和它互动过的用户（发过/start 或任何消息）发送消息。但不能给从未互动过的用户发消息（反垃圾设计）。群组中，Bot 可以主动向群组发送消息。超过 24 小时未互动的用户，Bot 只能用特定类型消息联系（如通过内联查询）。</div></div>
</div>
<div class="faq-item">
<div class="faq-q">Q：Bot 怎么收费？<span class="faq-arrow">▼</span></div>
<div class="faq-a"><div class="faq-a-inner">A：Telegram Bot API 完全免费。你的成本只有：运行 Bot 程序所需的服务器费用。轻量 Bot（每天几百次请求）用免费平台（Vercel、Render 免费版）即可零成本运行。</div></div>
</div>
<div class="faq-item">
<div class="faq-q">Q：Bot 的消息频率有限制吗？<span class="faq-arrow">▼</span></div>
<div class="faq-a"><div class="faq-a-inner">A：有限制。每个 Bot 每秒最多发送约 30 条消息到不同的聊天；同一个聊天中每秒最多约 1 条消息。超过限制会触发 429 Too Many Requests 错误，需要稍后重试。消息总量没有日上限。</div></div>
</div>
<div class="faq-item">
<div class="faq-q">Q：Bot 没有被拉入群组也能在群里发消息吗？<span class="faq-arrow">▼</span></div>
<div class="faq-a"><div class="faq-a-inner">A：不能。Bot 必须被拉入群组（并且拥有发送消息权限）才能在群里发消息。这是 Telegram 的安全设计，防止 Bot 在未授权的群中发布垃圾信息。</div></div>
</div>
<div class="faq-item">
<div class="faq-q">Q：我的 Bot 为什么不回复消息？<span class="faq-arrow">▼</span></div>
<div class="faq-a"><div class="faq-a-inner">A：常见原因排查：① 程序没有在运行（检查终端/服务器状态）；② Token 错误（用 @BotFather /revoke 重置再试）；③ 群组中隐私模式未关闭（Bot 收不到群消息）；④ Webhook URL 设置错误或无法访问；⑤ 代码逻辑问题（检查日志）。建议先用 Polling 模式在本地调试，确认没问题后再部署 Webhook。</div></div>
</div>
<div class="faq-item">
<div class="faq-q">Q：Bot 可以收款吗？<span class="faq-arrow">▼</span></div>
<div class="faq-a"><div class="faq-a-inner">A：可以。Telegram 内置了 Bot Payment API，支持通过 Stripe、YooMoney 等多种支付提供商收款。用户在 Bot 内点击"支付"按钮即可完成付款。需要使用 @BotFather 的 /mybots → Payments 配置支付提供商。</div></div>
</div>
</div>

---

Telegram Bot 是一个门槛很低但天花板很高的领域。写一个 Echo Bot 只需要 10 行代码，但一个成熟的 Bot 可以管理百万级社群、处理支付订单、完成复杂的自动化任务。从哪里开始不重要，开始了才重要。
