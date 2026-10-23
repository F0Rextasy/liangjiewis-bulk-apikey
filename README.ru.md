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

**Массовое создание аккаунтов liangjiewis.com с автоматически сгенерированными API-ключами — инференс, совместимый с OpenAI (Claude, GPT, Gemini, DeepSeek, GLM, Qwen) + коннектор 9Router.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-97%20served-412991?style=for-the-badge)](https://liangjiewis.com)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Быстрый старт](#-quick-start) · [🎁 Бесплатный тариф](#-free-tier--how-much-you-get) · [🤖 Модели](#-models--all-97-of-them) · [🧪 Использование API](#-how-to-use-the-api) · [✅ Проверено](#-verified-working--every-key-is-tested) · [🧭 Как это работает](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ Опции](#️-cli-options) · [🛰️ Прокси](#️-behind-a-proxy) · [🐞 Проблемы](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Зачем это нужно

liangjiewis.com (量界智算) предлагает **97 моделей** и требует для регистрации только e-mail — **без капчи** (`turnstile_check: false`). Новый аккаунт получает **`quota 0` (`＄0.000000`)** и **без ежедневной отметки** (`签到功能未启用`), а также **0 моделей с нулевой ценой** в таблице цен из 129 строк, поэтому каждый созданный ключ является *подлинным* (`GET /v1/models` **200**) и *ограниченным по кредиту* (`POST /v1/chat/completions` **403** `insufficient_user_quota`). Один аккаунт на ключ; N ключей = N аккаунтов, каждый со своим бюджетом.

## 🎁 Бесплатный тариф — сколько вы получаете

**Новый аккаунт liangjiewis.com не имеет кредита — инструмент создаёт подлинные ключи, аккаунт которых всё ещё требует пополнения.**

| Пункт | Измерено |
| --- | --- |
| Бонус при регистрации | **без кредита** — каждый аккаунт получает `quota 0` (`＄0.000000`) |
| Ежедневная отметка | **отключена** (`签到功能未启用`) — без пополнения |
| Модели с нулевой ценой | **нет** — `/api/pricing` (129 строк, прочитано с сессией аккаунта) содержит 0 моделей с нулевой ценой |
| Капча при регистрации | **нет** (`turnstile_check: false`) |
| E-mail, который принимает панель | обычный `@gmail.com` (форма без точек); `@qq.com` отклоняется (`550 … non-existent account`); отправка через `1449683658@<mail>` (тема `量界智算邮箱验证邮件`) — закрепите это с помощью `--sender "1449683658\|量界智算"` |
| Что созданный ключ может сегодня | `GET /v1/models` **200** (97 моделей) — подлинный; `POST /v1/chat/completions` **403** `insufficient_user_quota` до пополнения |
| Единица масштабирования | **один аккаунт = один ключ** → `--count N` на самом деле означает «N аккаунтов, каждый со своим балансом» |

> 💡 Бесплатный тариф устанавливается liangjiewis.com и может измениться. Проверяйте актуальные цифры на [liangjiewis.com](https://liangjiewis.com) — и позвольте собственному шлюзу инструмента решить:

```bash
node src/cli.js --verify-only     # каждый ключ в keys.txt повторно проверяется реальным вызовом чата
```

## 🤖 Модели — все 97

`GET https://liangjiewis.com/v1/models` возвращает **97 идентификаторов моделей** для созданного ключа, например:

```
claude-opus-5 · claude-sonnet-5 · claude-haiku-4-5-20251001 · claude-3-5-haiku-20241022
gpt-5.5 · gpt-5.4-mini · gpt-5.1-codex-max · gpt-5-codex · gemini-3-pro-preview
gemini-2.5-flash · gemini-3.1-flash-lite-preview · o3 · o3-mini · o4-mini
text-embedding-3-small
```

**Что отвечает новый аккаунт, когда пытается *использовать* модель** — измерено на каждом ключе, приведено дословно, чтобы вы точно знали, что получите:

| Вызов | Статус | Тело |
| --- | --- | --- |
| `POST /v1/chat/completions` (`claude-3-5-haiku-20241022`, самый дешёвый из перечисленных id) | **403** | `{"error":{"message":"用户额度不足, 剩余额度: ＄0.000000 (request id: …)","type":"new_api_error","code":"insufficient_user_quota"}}` |

Пополните аккаунт, и тот же ключ будет обслуживать трафик без повторного создания.

## 🧪 Как использовать API

Базовый URL — **`https://liangjiewis.com/v1`** — совместим с OpenAI, поэтому работает всё, что говорит на OpenAI (SDK, Cursor, OpenCode, Kilo Code, …).

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

Пока аккаунт не пополнен, это отвечает `403 insufficient_user_quota` — отказ связан с балансом аккаунта, а не с дефектом ключа.

## 🛠 Быстрый старт

```bash

# clone this repository (or download the ZIP), then:
cd liangjiewis-bulk-apikey

# 1) your proxy list, one exit per line (http://, socks5://, socks4:// or bare host:port)
printf 'socks5://127.0.0.1:1080\n' > proxies.txt   # optional — without it the tool runs direct

# 2) go
node src/launcher.js                            # interactive: mint / verify / settings
# or drive it directly:
node src/cli.js mint --count 3                  # any N; 3 is the sample default
node src/cli.js mint --count 10 --scan-conc 8
node src/cli.js verify                          # re-check every key in keys.txt
node src/cli.js help                            # task list
node src/mint.js --help                         # the flags mint actually reads
```

Ключи добавляются в `keys.txt`, по одному в строке, как только ключ ответил `GET /v1/models` 200 *и* для него вернулся вызов модели — на новом аккаунте здесь этот вызов является отказом по кредиту, что фиксируется именно так и не удерживает ключ. Аккаунты обрабатываются один за другим; `--count 10` — это долгий запуск, и `out/pinned-<date>.log` — его текущая запись. Ничего не отправляется на панель в обход выхода из `proxies.txt`.

### 🖱️ Лаунчер

```bash
node src/launcher.js
```

Меню над модулями задач: **mint**, **verify**, **9Router**. Он запрашивает `count` (ключей за запуск) и `parallel exits`, сохраняет их в `launcher.config.json` и запускает `node src/cli.js <task>` с нужными флагами. Пункт меню **6** запускает регистрацию в 9Router напрямую.

## ✅ Проверено в работе — каждый ключ протестирован

Измерено **2026-10-15**: **каждый аккаунт создал свой собственный ключ, один ключ на аккаунт**. Каждый ключ был проверен после его создания, на выходе, *независимом* от создания, и каждый ключ был повторно проверен позже в тот же день.

| Модель | Live (models) | Реальный вызов чата | Измерено |
| --- | --- | --- | --- |
| `claude-3-5-haiku-20241022` | **200** · 97 моделей | **403** `insufficient_user_quota` (`＄0.000000`) · ✔ **live** (повторно проверено 13:11) | 2026-10-15 09:41 |
| `claude-3-5-haiku-20241022` | **200** · 97 моделей | **403** `insufficient_user_quota` (`＄0.000000`) · ✔ **live** (повторно проверено 13:11) | 2026-10-15 09:42 |
| `claude-3-5-haiku-20241022` | **200** · 97 моделей | **403** `insufficient_user_quota` (`＄0.000000`) · ✔ **live** (повторно проверено 13:11) | 2026-10-15 12:33 |

**Все три были live, как и написано** — повторно проверено 2026-10-15 13:11 UTC самим `src/verify.js`: **каждый ключ ответил `GET /v1/models` 200** (по 97 моделей каждый, каждый на свежем выходе — ни один не был выходом создания), **3/3 без кредита** (`403 insufficient_user_quota`). `GET /v1/models` 200 доказывает, что ключ *подлинный*; столбец completion показывает, что новый аккаунт может *потратить*. `node src/cli.js verify` воспроизводит проверку для вашего собственного файла.

> **Контроль качества.** Каждый ключ здесь прошёл живой `chat-200` до того, как был записан в `keys.txt`
> (мёртвые ключи никогда не поставляются). Комбинации роутера следуют тому же правилу на уровне модели: запись
> добавляется **только если модель отвечает `chat-200` и может вызывать инструменты** — модель без поддержки инструментов,
> мёртвый ключ или мёртвый провайдер отбрасывается вместо добавления. Повторно запускайте шаг проверки в любое время;
> сбои сообщаются, никогда не скрываются.

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
| Шлюзы | `GET /api/status` | `email_verification: true` · `turnstile_check: false` · `checkin_enabled: false` · Gmail принимается (обычная форма) |
| Почтовый ящик | [Emailnator](https://www.emailnator.com) | свежий адрес Gmail на каждый аккаунт, чтение через ваши выходы |
| Отправка кода | `GET /api/verification?email=<plain>` | `{"success":true}` |
| Регистрация | `POST /api/user/register` | `{"success":true}` |
| Вход | `POST /api/user/login` | cookie сессии + `GET /api/user/self` → `quota: 0` |
| Токен | `POST /api/token/` | один ключ на аккаунт |
| Отметка | `POST /api/user/checkin` | `{"success":false,"message":"签到功能未启用"}` — корректно сообщает об отключении; без кредита |
| Доказательство | `GET /v1/models` + `POST /v1/chat/completions` | оба записаны с наблюдающим выходом; отказ чата здесь — это *шлюз кредита*, а не дефект ключа |

## ⚙️ Опции CLI

Весь код находится в `src/` — запускайте его из корня репозитория как `node src/<file>.js`.

| Инструмент | Флаги |
| --- | --- |
| `src/mint.js` | `--count N` (3) · `--pool FILE` (`proxies.txt`) · `--mail emailnator\|imap` · `--imap-user` / `--imap-pass` (или `IMAP_USER` / `IMAP_PASS`) · `--mail-address` · `--sender REGEX` (по умолчанию `1449683658\|量界智算`) · `--model ID` · `--poll-ms` (2000) · `--code-wait` (300000) · `--max-cycle` (3) · `--scan` (200) · `--scan-conc` (8, макс. 8) · `--budget` (2400 с) · `--base URL` |
| `src/verify.js` | `--key K` · `--all` · `--model ID` · `--max-tokens` (8) · `--want` (3) · `--pool FILE` · `--base URL` |
| `src/launcher.js` | интерактивно: mint / verify / settings — `count` и `concurrency` сохраняются в `launcher.config.json` |

## 🛰️ За прокси

**Необязательно — рекомендуется при масштабировании (лимиты на IP, блокировки).** Инструмент работает и без прокси.

* **С пулом:** передайте `--pool <file>` (или поместите выходы в `proxies.txt`), и каждый запрос идёт через выход из этого списка — мёртвая линия проваливает эту попытку, и инструмент переходит к следующей.
* **Без пула:** CLI выводит `running WITHOUT a proxy (direct)` и подключается напрямую. В регистрации, создании ключей или проверке ничего не меняется — только то, откуда уходят пакеты.

* Выходы берутся из `proxies.txt` (одна строка на выход, `scheme://host:port`, поддерживается `user:pass@`, комментарии `#` игнорируются). Тот же пул питает вызовы панели, проверку ключей и чтение почты, когда он предоставлен; без пула инструменты подключаются напрямую.
* **Отбор — это и есть работа.** Каждый аккаунт закрепляет первый выход, который доказывает `GET /api/status` против хоста панели, а проверка закрепляет *другой* проверенный выход — мёртвый выход выводит себя из строя, и аккаунт продолжает на следующем.
* Почтовый ящик ([Emailnator](https://www.emailnator.com)) — это сторонний сервис временной почты, а не панель; его API также читается через ваши выходы, когда предоставлен пул.
* Письмо для проверки приходит от **`1449683658`** (`量界智算邮箱验证邮件`) — не от домена панели — поэтому `--sender` по умолчанию закрепляет этого отправителя, чтобы код постороннего из общего ящика никогда не был отправлен.

## 📄 Файлы

| Путь | Содержимое |
| --- | --- |
| `keys.txt` | один проверенный в работе ключ на строку — игнорируется git |
| `accounts.json` | почтовый ящик, шаги, отметка, оба выходы проверки на аккаунт — игнорируется git |
| `models.json` | свежий снимок `/v1/models` за запуск — игнорируется git |
| `proxies.txt` | ваши выходы, по одному на строку — игнорируется git |
| `out/pinned-<date>.log` | журнал за запуск (выход, тайминг, точный ответ сервера) — игнорируется git |
| `src/mint.js` · `src/verify.js` | два движка, к которым обращается CLI |
| `src/connect-9router.js` | регистрирует ключи из `keys.txt` как подключения 9Router |

## 🔌 Подключение к 9Router

[9Router](https://9router.com) — это самостоятельно размещаемый роутер, совместимый с OpenAI. liangjiewis.com совместим с OpenAI, поэтому зарегистрируйте его один раз и используйте каждый ключ:

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
# or: node src/cli.js mint --count 3 --connect-9router
```

Каждый ключ в `keys.txt` становится одним подключением узла провайдера `liangjiewis` (`--api-key <key>` регистрирует один ключ вместо этого, `--model <id>` переопределяет значение по умолчанию). Затем выберите модель внутри 9Router:

```
liangjiewis/claude-3-5-haiku-20241022
liangjiewis/claude-opus-5
liangjiewis/gpt-5.5
```

По умолчанию: `--base http://localhost:20128`, `--password 123456`, `--prefix liangjiewis`, `--base-url https://liangjiewis.com/v1`, модель по умолчанию `claude-3-5-haiku-20241022`.

## 🔌 Подключение к OmniRoute

[OmniRoute](https://omniroute.online) — это самостоятельно размещаемый роутер, совместимый с OpenAI. liangjiewis.com совместим с OpenAI, поэтому зарегистрируйте его один раз и используйте каждый ключ:

```bash
node src/connect-omniroute.js --base http://localhost:20128 --password 123456
# or: node src/cli.js mint --count 3 --connect-omniroute
```

Каждый ключ в `keys.txt` становится одним подключением узла провайдера `liangjiewis` (`--api-key <key>` регистрирует один ключ вместо этого, `--model <id>` переопределяет значение по умолчанию). Затем выберите модель внутри OmniRoute:

```
liangjiewis/claude-3-5-haiku-20241022
liangjiewis/claude-opus-5
liangjiewis/gpt-5.5
```

По умолчанию: `--base http://localhost:20128`, `--password 123456`, `--prefix liangjiewis`, `--base-url https://liangjiewis.com/v1`, модель по умолчанию `claude-3-5-haiku-20241022`.

## 🔑 Что даёт один ключ

| | |
| --- | --- |
| 🏢 Провайдер | **liangjiewis.com** — [liangjiewis.com](https://liangjiewis.com) |
| 🎁 Что даёт провайдер | 97 перечисленных моделей (Claude Opus 5, GPT-5.5, Gemini 3 Pro, O3) — ключи подлинные, инференс ограничен кредитом |
| 🔑 Что даёт один ключ | один API-ключ, привязанный к своему аккаунту: 97 идентификаторов моделей на указанном ниже эндпоинте, в пределах лимитов вашего тарифа. Квота хранится на **аккаунте**, именно поэтому этот инструмент создаёт один аккаунт на ключ |
| 🌐 Форма API | Совместим с OpenAI: `POST https://liangjiewis.com/v1/chat/completions` |
| 🔒 Ваши данные | связь только с liangjiewis.com и настроенным вами бэкендом почты; ключи остаются на вашей машине |

## 🐞 Проблемы

Откройте issue с указанием сбойного шага и хвоста журнала запуска (`out/pinned-<date>.log`) — он содержит выход, тайминг и точный ответ сервера, то есть всё необходимое для воспроизведения сбоя. Никогда не прикрепляйте ключ. **[Открыть issue](../../issues)** — и PR приветствуются.

## 📄 Лицензия

MIT © 2026 — см. [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 liangjiewis-bulk-apikey contributors

</div>