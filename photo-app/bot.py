#!/usr/bin/env python3
"""
Telegram Bot для мини-аппа раздача стиля
Запускает мини-апп по команде /start и кнопке меню
"""

import os
import logging
from dotenv import load_dotenv
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo, MenuButtonWebApp, BotCommand
from telegram.ext import Application, CommandHandler, ContextTypes

load_dotenv(dotenv_path="scraper/.env")

BOT_TOKEN    = os.getenv("BOT_TOKEN", "")
MINI_APP_URL = os.getenv("MINI_APP_URL", "https://bazuevaconsult.com/photo-app/")

logging.basicConfig(
    format="%(asctime)s | %(levelname)s | %(message)s",
    level=logging.INFO
)

# ─── ХЭНДЛЕРЫ ─────────────────────────────────────────────────────────────────

async def cmd_start(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    keyboard = InlineKeyboardMarkup([[
        InlineKeyboardButton(
            text="📷 Открыть раздача стиля",
            web_app=WebAppInfo(url=MINI_APP_URL)
        )
    ]])
    await update.message.reply_text(
        "Привет! 👋\n\n"
        "Здесь всё про фотографию — рецепты съёмки, обработка, видеоуроки и курс «Сам себе фотограф».\n\n"
        "Нажми кнопку ниже чтобы открыть 👇",
        reply_markup=keyboard
    )

async def cmd_app(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    keyboard = InlineKeyboardMarkup([[
        InlineKeyboardButton(
            text="Открыть приложение",
            web_app=WebAppInfo(url=MINI_APP_URL)
        )
    ]])
    await update.message.reply_text("Открываю 👇", reply_markup=keyboard)

# ─── НАСТРОЙКА БОТА ───────────────────────────────────────────────────────────

async def on_startup(app):
    """Устанавливает кнопку меню и команды при старте"""
    await app.bot.set_my_commands([
        BotCommand("start", "Открыть раздача стиля"),
        BotCommand("app",   "Открыть мини-апп"),
    ])
    await app.bot.set_chat_menu_button(
        menu_button=MenuButtonWebApp(
            text="раздача стиля",
            web_app=WebAppInfo(url=MINI_APP_URL)
        )
    )
    print(f"✅ Бот запущен. Мини-апп: {MINI_APP_URL}")

# ─── ЗАПУСК ───────────────────────────────────────────────────────────────────

def main():
    if not BOT_TOKEN:
        print("❌ BOT_TOKEN не задан. Проверь файл scraper/.env")
        return

    app = (
        Application.builder()
        .token(BOT_TOKEN)
        .post_init(on_startup)
        .build()
    )

    app.add_handler(CommandHandler("start", cmd_start))
    app.add_handler(CommandHandler("app",   cmd_app))

    print("🚀 Запускаю бота...")
    app.run_polling(drop_pending_updates=True)

if __name__ == "__main__":
    main()
