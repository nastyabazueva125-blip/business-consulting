#!/usr/bin/env python3
"""
Telegram Channel Scraper
Скрейпит все посты из закрытого канала и сортирует по темам (топикам).
Результат сохраняется в data.json для использования в мини-аппе.
"""

import asyncio
import json
import os
import sys
from datetime import datetime
from pathlib import Path

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

try:
    from telethon import TelegramClient
    from telethon.tl.types import (
        MessageMediaPhoto,
        MessageMediaDocument,
        MessageMediaWebPage,
    )
    from telethon.errors import FloodWaitError
except ImportError:
    print("Установи зависимости: pip install -r requirements.txt")
    sys.exit(1)

# ─── Конфиг ───────────────────────────────────────────────────────────────────
# Получить API_ID и API_HASH на https://my.telegram.org → App configuration
API_ID   = os.getenv("TG_API_ID", "")
API_HASH = os.getenv("TG_API_HASH", "")

# username канала или ссылка-приглашение (https://t.me/+xxxx)
CHANNEL  = os.getenv("TG_CHANNEL", "")

# Скачивать ли фото (True = скачать в папку media/, False = только текст)
DOWNLOAD_PHOTOS = True

# Маппинг: название топика (как в канале) → slug для мини-аппа
TOPIC_MAP = {
    "рецепты фото":       "recipes_photo",
    "рецепты обра":       "recipes_editing",   # Telegram обрезает длинные имена
    "рецепты ф":          "recipes_photo",
    "видео уроки":        "video_lessons",
    "насмотрелись":       "watched",
    "a еще?":             "more",
    "обработка":          "recipes_editing",
    "ai":                 "ai",
    "задания":            "tasks",
    "визуальчик":         "general",
    "general":            "general",
}

MEDIA_DIR = Path("media")
MEDIA_DIR.mkdir(exist_ok=True)

# ─── Хелперы ──────────────────────────────────────────────────────────────────

def slugify_topic(name: str) -> str:
    """Находит slug по части названия топика."""
    name_lower = name.lower().strip()
    for key, slug in TOPIC_MAP.items():
        if key in name_lower or name_lower in key:
            return slug
    # Если не найдено — используем транслит-заглушку
    return name_lower.replace(" ", "_")[:30]


def serialize_message(msg, topic_name: str, media_path) -> dict:
    return {
        "id":         msg.id,
        "topic":      topic_name,
        "date":       msg.date.isoformat(),
        "text":       msg.text or "",
        "media_type": None,
        "media_path": media_path,
        "views":      getattr(msg, "views", None),
        "forwards":   getattr(msg, "forwards", None),
    }


# ─── Основной скрейпер ────────────────────────────────────────────────────────

async def scrape(client: TelegramClient):
    print(f"\n📡 Подключаюсь к каналу: {CHANNEL}")
    channel = await client.get_entity(CHANNEL)
    print(f"✅ Канал найден: {channel.title}")

    # Получаем топики (форум-темы)
    topics: dict[int, str] = {}  # message_id → topic_name

    try:
        from telethon.tl.functions.channels import GetForumTopicsRequest
        result = await client(GetForumTopicsRequest(
            channel=channel,
            offset_date=0,
            offset_id=0,
            offset_topic=0,
            limit=100,
            q=""
        ))
        for topic in result.topics:
            topics[topic.id] = topic.title
            print(f"  📂 Топик найден: [{topic.id}] {topic.title}")
    except Exception:
        print("  ℹ️  Форум-топики не найдены — канал без тем или обычная группа")

    # Скрейпим все сообщения
    print(f"\n⏳ Скрейплю сообщения...")
    all_messages: list[dict] = []
    count = 0

    async for msg in client.iter_messages(channel, limit=None, reverse=True):
        if not msg or msg.service:
            continue

        # Определяем топик сообщения
        topic_id   = None
        topic_name = "general"

        if msg.reply_to:
            topic_id = getattr(msg.reply_to, "reply_to_top_id", None) \
                    or getattr(msg.reply_to, "reply_to_msg_id", None)

        if topic_id and topic_id in topics:
            topic_name = topics[topic_id]

        # Скачиваем медиа
        media_path = None
        media_type = None

        try:
            if DOWNLOAD_PHOTOS and isinstance(msg.media, MessageMediaPhoto):
                path = MEDIA_DIR / f"photo_{msg.id}.jpg"
                if not path.exists():
                    await client.download_media(msg, file=str(path))
                media_path = str(path)
                media_type = "photo"

            elif isinstance(msg.media, MessageMediaDocument):
                doc = msg.media.document
                mime = doc.mime_type or ""
                if mime.startswith("video"):
                    media_type = "video"
                elif mime.startswith("image"):
                    media_type = "image"
                    if DOWNLOAD_PHOTOS:
                        path = MEDIA_DIR / f"img_{msg.id}.jpg"
                        if not path.exists():
                            await client.download_media(msg, file=str(path))
                        media_path = str(path)

            elif isinstance(msg.media, MessageMediaWebPage):
                media_type = "webpage"

        except FloodWaitError as e:
            print(f"  ⚠️  Flood wait {e.seconds}s...")
            await asyncio.sleep(e.seconds)
        except Exception as e:
            print(f"  ⚠️  Медиа {msg.id}: {e}")

        entry = serialize_message(msg, topic_name, media_path)
        entry["media_type"] = media_type
        all_messages.append(entry)
        count += 1

        if count % 50 == 0:
            print(f"  ...обработано {count} сообщений")

    print(f"\n✅ Всего сообщений: {count}")

    # Группируем по slug категории
    categories: dict[str, list] = {}
    for msg in all_messages:
        slug = slugify_topic(msg["topic"])
        if slug not in categories:
            categories[slug] = []
        categories[slug].append(msg)

    # Финальный JSON
    output = {
        "channel":     channel.title,
        "exported_at": datetime.now().isoformat(),
        "total":       count,
        "categories":  categories,
    }

    out_path = Path("data.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2, default=str)

    print(f"\n💾 Сохранено в {out_path.resolve()}")
    print("\n📊 Статистика по категориям:")
    for slug, msgs in categories.items():
        print(f"  {slug}: {len(msgs)} постов")


# ─── Точка входа ──────────────────────────────────────────────────────────────

async def main():
    global API_ID, API_HASH, CHANNEL

    if not API_ID:
        API_ID = input("Введи API_ID (с https://my.telegram.org): ").strip()
    if not API_HASH:
        API_HASH = input("Введи API_HASH: ").strip()
    if not CHANNEL:
        CHANNEL = input("Введи username или ссылку канала (напр. @mychannel): ").strip()

    client = TelegramClient("session_scraper", int(API_ID), API_HASH)

    async with client:
        await client.start()
        await scrape(client)


if __name__ == "__main__":
    asyncio.run(main())
