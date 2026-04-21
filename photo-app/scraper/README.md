# Telegram Channel Scraper

Скрейпит все посты из закрытого канала по топикам и сохраняет в `data.json`.

## Шаг 1 — Получить API ключи

1. Открой https://my.telegram.org
2. Войди со своим номером телефона
3. Перейди в **"API development tools"**
4. Создай приложение (любое название)
5. Скопируй `App api_id` и `App api_hash`

## Шаг 2 — Установить зависимости

```bash
pip install -r requirements.txt
```

## Шаг 3 — Запустить скрейпер

```bash
python scraper.py
```

Скрипт спросит:
- `API_ID` — число с my.telegram.org
- `API_HASH` — строка с my.telegram.org
- Ссылку или username канала (например `@mychannel` или `https://t.me/+xxxxx`)

При первом запуске Telegram попросит войти через номер телефона и код из SMS.
Сессия сохранится в файл `session_scraper.session` — повторно логиниться не нужно.

## Или через переменные окружения

```bash
export TG_API_ID=12345678
export TG_API_HASH=abcdef1234567890abcdef1234567890
export TG_CHANNEL=@mychannel
python scraper.py
```

## Результат

- `data.json` — все посты, сгруппированные по категориям
- `media/` — скачанные фото

### Структура data.json

```json
{
  "channel": "Название канала",
  "exported_at": "2026-04-21T...",
  "total": 350,
  "categories": {
    "recipes_photo": [ { "id": 1, "text": "...", "date": "...", "media_type": "photo", ... } ],
    "recipes_editing": [ ... ],
    "video_lessons": [ ... ],
    "watched": [ ... ]
  }
}
```
