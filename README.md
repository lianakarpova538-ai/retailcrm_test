# RetailCRM + Supabase + Telegram — Тестовое задание

## Что сделано

Автоматизация загрузки заказов в RetailCRM, синхронизация с Supabase и уведомления в Telegram. Всё реализовано в **n8n**.

## Процесс работы и промпты

### Шаг 1: Загрузка 50 заказов в RetailCRM

**Реальный промпт:**
> "Шаг 2: Загрузи заказы в RetailCRM через API. У меня ошибки 400 и 503, не могу загрузить все 50."

**С чем столкнулась:**
- 400 ошибки из-за неверного формата тела запроса
- 503 ошибки при попытке отправить все 50 заказов сразу
- Order already exists при повторных запусках

**Что помогло:**
- Настройка Batch в HTTP Request узле (по 1 заказу с интервалом 500ms)
- Правильный формат: `Form-Urlencoded` с параметрами `site` и `order`
- `JSON.stringify($json.order)` для корректной передачи вложенных данных
- Добавление `Date.now()` в `externalId` для уникальности

<img width="1224" height="338" alt="image" src="https://github.com/user-attachments/assets/97aac27e-6f11-48cc-9fa9-b27bccb9c1bf" />

<img width="885" height="663" alt="image" src="https://github.com/user-attachments/assets/67ccc8c3-eebf-4e43-9ce0-834072a52353" />

<img width="1908" height="857" alt="image" src="https://github.com/user-attachments/assets/8835df80-1d69-4ada-90bb-8cce22b87cbd" />


---

### Шаг 2: Синхронизация RetailCRM → Supabase

**Реальный промпт:**
> "Шаг 3: RetailCRM → Supabase. Данные приходят, но в Supabase первые 50 строк NULL."

**С чем столкнулась:**
- Встроенный узел Supabase не работал как ожидалось
- Пустые строки при вставке
- Ошибка `[object Object] is not valid JSON`

**Что помогло:**
- Замена встроенного узла Supabase на HTTP Request
- Прямой вызов Supabase REST API
- `JSON.stringify($json)` для тела запроса
- Заголовок `Prefer: resolution=merge-duplicates` для upsert

<img width="1164" height="386" alt="image" src="https://github.com/user-attachments/assets/797e1da1-842c-4908-82d9-cba86c0583a0" />

<img width="1573" height="782" alt="image" src="https://github.com/user-attachments/assets/c1152596-73db-4bec-8919-fadf98344d43" />

<img width="905" height="575" alt="image" src="https://github.com/user-attachments/assets/be5eacce-d473-4138-a3bb-c32e82204730" />

<img width="1430" height="829" alt="image" src="https://github.com/user-attachments/assets/d456e02d-f047-42d4-9d81-439f7b87ff25" />

---

### Шаг 4: Telegram-уведомления

**Реальный промпт:**
> "Настрой уведомление в Telegram когда заказ > 50,000 ₸. Фильтры API не работают, статусы не совпадают."

**С чем столкнулась:**
- Фильтрация через API RetailCRM не работала (ошибки формата)
- Статус заказов был `offer-analog`, а не `new`
- Данные приходили в `response.orders`, а не напрямую

**Что помогло:**
- Перенос фильтрации из API в JavaScript код внутри n8n
- Отказ от фильтра по статусу
- Правильное извлечение массива заказов: `response.orders`
- Поиск суммы в поле `totalSumm`

<img width="1128" height="359" alt="image" src="https://github.com/user-attachments/assets/a14050f5-f7a7-4a14-9257-9c972a933547" />

<img width="1833" height="848" alt="image" src="https://github.com/user-attachments/assets/7cede7e3-172b-4cc7-8713-aa1e7cb50330" />

<img width="1460" height="656" alt="image" src="https://github.com/user-attachments/assets/4ecea7fd-aaa1-4e0d-a943-ca0ac6a4c2d9" />

<img width="1853" height="829" alt="image" src="https://github.com/user-attachments/assets/a0392c14-12e4-44f5-a27d-ff3d78f0db28" />

---

## 📊 Итоговый статус

| Задача | Статус |
|--------|--------|
| Аккаунты (RetailCRM, Supabase, Vercel, Telegram) | ✅ |
| Загрузка 50 заказов в RetailCRM | ✅ |
| Синхронизация RetailCRM → Supabase | ✅ |
| Дашборд с графиком на Vercel | ✅ |
| Telegram-уведомления (> 50,000 ₸) | ✅ |

## 🔗 Ссылки

- Дашборд: file:///C:/Users/Lian/Desktop/retailcrm-dashboard/index.html

