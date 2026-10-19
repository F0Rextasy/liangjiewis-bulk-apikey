<div align="center">

```
██╗     ██╗ █████╗ ███╗   ██╗ ██████╗      ██╗██╗███████╗██╗    ██╗██╗███████╗
██║     ██║██╔══██╗████╗  ██║██╔════╝      ██║██║██╔════╝██║    ██║██║██╔════╝
██║     ██║███████║██╔██╗ ██║██║  ███╗     ██║██║█████╗  ██║ █╗ ██║██║███████╗
██║     ██║██╔══██║██║╚██╗██║██║   ██║██   ██║██║██╔══╝  ██║███╗██║██║╚════██║
███████╗██║██║  ██║██║ ╚████║╚██████╔╝╚█████╔╝██║███████╗╚███╔███╔╝██║███████║
╚══════╝╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝  ╚════╝ ╚═╝╚══════╝ ╚══╝╚══╝ ╚═╝╚══════╝
```

# liangjiewis-bulk-apikey

**Массовое создание аккаунтов liangjiewis.com с автоматически сгенерированными API-ключами — OpenAI-совместимый инференс (Claude, GPT, Gemini, DeepSeek, GLM, Qwen) + коннектор 9Router.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-97%20served-412991?style=for-the-badge)](https://liangjiewis.com)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Быстрый старт](#-quick-start) · [🎁 Бесплатный тариф](#-free-tier--how-much-you-get) · [🤖 Модели](#-models--all-97-of-them) · [🧪 Использование API](#-how-to-use-the-api) · [✅ Проверено](#-verified-working--every-key-is-tested) · [🧭 Как это работает](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Параметры](#️-cli-options) · [🛰️ Прокси](#️-behind-a-proxy) · [🐞 Проблемы](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>




---

## ✨ Зачем это нужно

liangjiewis.com (量界智算) предлагает **97 моделей** и требует при регистрации только e-mail — **без капчи** (`turnstile_check: false`). Новый аккаунт получает **`quota 0` (`＄0.000000`)** **без ежедневной отметки** (`签到功能未启用`) и **0 моделей с нулевой ценой** в своей таблице цен из 129 строк, поэтому каждый созданный ключ является *подлинным* (`GET /v1/models` **200**) и *доступным только при наличии кредита* (`POST /v1/chat/completions` **403** `insufficient_user_quota`). Один аккаунт на ключ; N ключей = N аккаунтов, каждый со своим бюджетом.

## 🎁 Бесплатный тариф — сколько вы получаете

**Свежий аккаунт liangjiewis.com не имеет кредита — инструмент создаёт подлинные ключи, аккаунт которых всё ещё требует пополнения.**

| Пункт | Измерено |
| --- | --- |
| Бонус при регистрации | **без кредита** — каждый аккаунт приходит с `quota 0` (`＄0.000000`) |
| Ежедневная отметка | **отключена** (`签到功能未启用`) — без пополнения |
| Модели с нулевой ценой | **нет** — `/api/pricing` (129 строк, читается с сессией аккаунта) содержит 0 моделей с нулевой ценой |
| Капча при регистрации | **нет** (`turnstile_check: false`) |
| Почта, которую принимает панель | обычный `@gmail.com` (форма без точек); `@qq.com` отклоняется (`550 … non-existent account`); отправка через `1449683658@qq.com` (тема `量界智算邮箱验证邮件`) — закрепите его через `--sender "1449683658\|量界智算"` |
| Что созданный ключ может сегодня | `GET /v1/models` **200** (97 моделей) — подлинный; `POST /v1/chat/completions` **403** `insufficient_user_quota`, пока не пополнен |
| Единица масштабирования | **один аккаунт = один ключ** → `--count N` на самом деле означает «N аккаунтов, у каждого свой баланс» |

> 💡 Бесплатный тариф задаётся liangjiewis.com и может измениться. Проверяйте актуальные цифры на [liangjiewis.com](https://liangjiewis.com) — и пусть решает собственный контроль инструмента:

```bash
node src/cli.js verify                 # every key in keys.txt is re-tested against the live API
```

## 🤖 Модели — все 97

`GET https://liangjiewis.com/v1/models` возвращает **97 идентификаторов моделей** для созданного ключа, например:

```
claude-opus-5 · claude-sonnet-5 · claude-haiku-4-5-20251001 · claude-3-5-haiku-20241022
gpt-5.5 · gpt-5.4-mini · gpt-5.1-codex-max · gpt-5-codex · gemini-3-pro-preview
gemini-2.5-flash · gemini-3.1-flash-lite-preview · o3 · o3-mini · o4-mini
text-embedding-3-small
```

**Что отвечает свежий аккаунт, когда пытается *использовать* модель** — измерено на каждом ключе: `POST /v1/chat/completions` отвечает `403` `{"error":{"message":"用户额度不足, 剩余额度: ＄0.000000 (request id: …)","type":"new_api_error","code":"insufficient_user_quota"}}`, пока аккаунт не пополнен. Повторное сканирование ключей репозитория 2026-10-19 показало, что **2 из 5 пополнены**: эти ключи отвечают `200` на приведённые ниже id, тогда как любой другой id из каталога по-прежнему возвращает отказ по кредиту. Пополните аккаунт, и тот же ключ будет обслуживать трафик без повторного создания.

|Модель|✓|
|---|---|
|`claude-3-5-haiku-20241022`|✓|
|`claude-3-5-sonnet-20240620`|✓|
|`claude-haiku-4-5-20251001`|✓|
|`claude-opus-4-1-20250805`|✓|

## 🧪 Как использовать API

Базовый URL — **`https://liangjiewis.com/v1`** — OpenAI-совместимый, поэтому работает всё, что говорит на OpenAI (SDK, Cursor, OpenCode, Kilo Code, …).

```bash
curl https://liangjiewis.com/v1/chat/completions \
  -H "Authorization: Bearer <one of your keys>" \
  -H "Content-Type: application/json" \
  -d '{"model":"claude-3-5-haiku-20241022","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

```python
from openai import OpenAI
client = OpenAI(base_url="https://liangjiewis.com/v1", api_key="<your key>")
print(client.chat.completions.create(model="claude-3-5-haiku-20241022",
      messages=[{"role": "user", "content": "hi"}]).choices[0].message.content)
```

Пока аккаунт не пополнен, это возвращает `403 insufficient_user_quota` — отказ связан с балансом аккаунта, а не с дефектом ключа.

## 🛠 Быстрый старт

```bash
# clone this repository (or download the ZIP), then:
cd liangjiewis-bulk-apikey

# 1) your proxy list, one exit per line (http://, socks5://, socks4:// or bare host:port)
printf 'socks5://127.0.0.1:1080\n' > proxies.txt

# 2) go
node src/launcher.js                            # interactive: mint / verify / settings
# or drive it directly:
node src/cli.js mint --count 3                  # any N; 3 is the sample default
node src/cli.js mint --count 10 --scan-conc 8
node src/cli.js verify                          # re-check every key in keys.txt
node src/cli.js help                            # task list
node src/mint.js --count 3 --help               # mint's own flag reference
```

Ключи добавляются в `keys.txt`, по одному на строку, как только ключ ответил `GET /v1/models` 200 *и* для него вернулся вызов модели — на свежем аккаунте здесь этот вызов является отказом по кредиту, который фиксируется именно так и не мешает сохранению ключа. Аккаунты запускаются один за другим; `--count 10` — это долгий запуск, а `out/pinned-<date>.log` — его текущий журнал. В панель не отправляется ничего, что не проходит через выход из `proxies.txt`.

### 🖱️ Лаунчер

```bash
node src/launcher.js
```

Меню над модулями задач: **mint**, **verify**, **9Router**. Оно запрашивает `count` (ключей за запуск) и `parallel exits`, сохраняет их в `launcher.config.json` и запускает `node src/cli.js <task>` с нужными флагами. Пункт меню **6** напрямую запускает регистрацию в 9Router.

## ✅ Проверено — каждый ключ протестирован

Измерено **2026-10-15**: **3 аккаунта → 3 ключа, один ключ на аккаунт**. Каждый ключ проверялся после создания, через выход, *независимый* от процесса создания, и каждый ключ был повторно проверен позже в тот же день.

| Модель | В сети (модели) | Реальный вызов чата | Измерено |
| --- | --- | --- | --- |
| `claude-3-5-haiku-20241022` | **200** · 97 моделей | **403** `insufficient_user_quota` (`＄0.000000`) · ✔ **в сети** (перепроверено 13:11) | 2026-10-15 12:33 |

**Все три были рабочими, как и заявлено** — перепроверено 2026-10-15 13:11 UTC самим `src/verify.js`: **3/3 ключа ответили `GET /v1/models` 200** (по 97 моделей каждый, каждый через свежий выход — ни один не принадлежал процессу создания), **3/3 без кредита** (`403 insufficient_user_quota`). `GET /v1/models` 200 доказывает, что ключ *подлинный*; столбец с completions показывает, что свежий аккаунт может *потратить*. `node src/cli.js verify` воспроизводит проверку для вашего файла.

## 🧭 Как это работает

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: liangjiewis.com page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://liangjiewis.com/v1/chat/completions → real content = the key is live
```

| Шаг | Вызов | Примечания |
| --- | --- | --- |
| Проверки | `GET /api/status` | `email_verification: true` · `turnstile_check: false` · `checkin_enabled: false` · Gmail принимается (обычная форма) |
| Почтовый ящик | [Emailnator](https://www.emailnator.com) | свежий адрес Gmail для каждого аккаунта, читается через ваши выходы |
| Отправка кода | `GET /api/verification?email=<plain>` | `{"success":true}` |
| Регистрация | `POST /api/user/register` | `{"success":true}` |
| Вход | `POST /api/user/login` | cookie сессии + `GET /api/user/self` → `quota: 0` |
| Токен | `POST /api/token/` | один ключ на аккаунт |
| Отметка | `POST /api/user/checkin` | `{"success":false,"message":"签到功能未启用"}` — корректно сообщает об отключении; без кредита |
| Доказательство | `GET /v1/models` + `POST /v1/chat/completions` | оба записаны с наблюдающим выходом; отказ чата здесь — это кредитный шлюз, а не дефект ключа |

## ⚙️ Параметры CLI

Весь код находится в `src/` — запускайте из корня репозитория командой `node src/<file>.js`.

| Инструмент | Флаги |
| --- | --- |
| `src/mint.js` | `--count N` (3) · `--pool FILE` (`proxies.txt`) · `--mail emailnator\|imap` · `--imap-user` / `--imap-pass` (or `IMAP_USER` / `IMAP_PASS`) · `--mail-address` · `--sender REGEX` (default `1449683658\|量界智算`) · `--model ID` · `--poll-ms` (2000) · `--code-wait` (300000) · `--max-cycle` (3) · `--scan` (200) · `--scan-conc` (8, max 8) · `--budget` (2400 s) · `--base URL` |
| `src/verify.js` | `--key K` · `--all` · `--model ID` · `--max-tokens` (8) · `--want` (3) · `--pool FILE` · `--base URL` |
| `src/launcher.js` | интерактивно: mint / verify / настройки — `count` и `concurrency` сохраняются в `launcher.config.json` |

## 🛰️ За прокси

* Выходы берутся из `proxies.txt` (одна строка на выход, `scheme://host:port`, поддерживается `user:pass@`, комментарии `#` игнорируются). Тот же пул используется для вызовов панели, проверки ключей и чтения почты; инструменты никогда не обращаются к провайдеру напрямую.
* **Отбор — это основная работа.** Каждый аккаунт закрепляет первый выход, который подтверждает `GET /api/status` на хосте панели, а проверка закрепляет *другой* подтверждённый выход — мёртвый выход выбывает сам, и аккаунт продолжает на следующем.
* Почтовый ящик ([Emailnator](https://www.emailnator.com)) — это сторонний сервис временной почты, а не панель; его API также читается через ваши выходы.
* Письмо для подтверждения приходит от **`1449683658@qq.com`** (`量界智算邮箱验证邮件`) — не с домена панели — поэтому стандартный `--sender` закрепляет этого отправителя, чтобы код постороннего из общего ящика никогда не был отправлен.

## 📄 Файлы

| Путь | Содержимое |
| --- | --- |
| `keys.txt` | один проверенный рабочий ключ на строку — игнорируется git |
| `accounts.json` | почтовый ящик, шаги, отметка, оба проверочных выхода для каждого аккаунта — игнорируется git |
| `models.json` | свежий снимок `/v1/models` за каждый запуск — игнорируется git |
| `proxies.txt` | ваши выходы, по одному на строку — игнорируется git |
| `out/pinned-<date>.log` | журнал каждого запуска (выход, тайминг, точный ответ сервера) — игнорируется git |
| `src/mint.js` · `src/verify.js` | два движка, к которым обращается CLI |
| `src/connect-9router.js` | регистрирует ключи из `keys.txt` как подключения 9Router |

## 🔌 Подключение к 9Router

[9Router](https://9router.com) — это самостоятельно размещаемый OpenAI-совместимый роутер. liangjiewis.com OpenAI-совместим, поэтому зарегистрируйте его один раз и используйте каждый ключ:

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
# or: node src/cli.js mint --count 3 --connect-9router
```

Каждый ключ в `keys.txt` становится одним подключением узла провайдера `liangjiewis` (`--api-key <key>` регистрирует вместо этого один ключ, `--model <id>` переопределяет модель по умолчанию). Затем выберите модель внутри 9Router:

```
liangjiewis/claude-3-5-haiku-20241022
liangjiewis/claude-opus-5
liangjiewis/gpt-5.5
```

Значения по умолчанию: `--base http://localhost:20128`, `--password 123456`, `--prefix liangjiewis`, `--base-url https://liangjiewis.com/v1`, модель по умолчанию `claude-3-5-haiku-20241022`.

## 🔑 Что даёт один ключ

| | |
| --- | --- |
| 🏢 Провайдер | **liangjiewis.com** — [liangjiewis.com](https://liangjiewis.com) |
| 🎁 Что даёт провайдер | перечислено 97 моделей (Claude Opus 5, GPT-5.5, Gemini 3 Pro, O3) — ключи подлинные, инференс ограничен кредитом |
| 🔑 Что даёт один ключ | один API-ключ, привязанный к своему аккаунту: 97 идентификаторов моделей на эндпоинте ниже, в пределах лимитов вашего тарифа. Квота живёт на **аккаунте**, поэтому этот инструмент создаёт один аккаунт на ключ |
| 🌐 Формат API | OpenAI-совместимый: `POST https://liangjiewis.com/v1/chat/completions` |
| 🔒 Ваши данные | связь только с liangjiewis.com и настроенным вами бэкендом входящей почты; ключи остаются на вашей машине |

## 🐞 Проблемы

Откройте issue с указанием сбойного шага и конца журнала запуска (`out/pinned-<date>.log`) — там есть выход, тайминг и точный ответ сервера, то есть всё необходимое для воспроизведения промаха. Никогда не прикрепляйте ключ. **[Открыть issue](../../issues)**, PR приветствуются.

## 📄 Лицензия

MIT © 2026 — см. [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 участники liangjiewis-bulk-apikey

</div>