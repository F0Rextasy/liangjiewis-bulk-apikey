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

**Crea cuentas de liangjiewis.com en masa con claves API autogeneradas — inferencia compatible con OpenAI (Claude, GPT, Gemini, DeepSeek, GLM, Qwen) + conector 9Router.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-97%20served-412991?style=for-the-badge)](https://liangjiewis.com)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Inicio rápido](#-quick-start) · [🎁 Nivel gratuito](#-free-tier--how-much-you-get) · [🤖 Modelos](#-models--all-97-of-them) · [🧪 Usar la API](#-how-to-use-the-api) · [✅ Verificado](#-verified-working--every-key-is-tested) · [🧭 Cómo funciona](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Opciones](#️-cli-options) · [🛰️ Proxies](#️-behind-a-proxy) · [🐞 Problemas](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>


---

## ✨ Por qué existe esto

liangjiewis.com (量界智算) lista **97 modelos** y restringe el registro solo por correo electrónico — **sin captcha** (`turnstile_check: false`). Una cuenta nueva llega a **`quota 0` (`＄0.000000`)** sin **check-in diario** (`签到功能未启用`) y con **0 modelos a precio cero** en su tabla de precios de 129 filas, así que cada clave generada es *auténtica* (`GET /v1/models` **200**) y *limitada por crédito* (`POST /v1/chat/completions` **403** `insufficient_user_quota`). Una cuenta por clave; N claves = N cuentas, cada una con su propio presupuesto.

## 🎁 Nivel gratuito — cuánto obtienes

**Una cuenta nueva de liangjiewis.com no trae crédito — la herramienta genera claves auténticas cuya cuenta aún necesita una recarga.**

| Elemento | Medido |
| --- | --- |
| Concesión por registro | **sin crédito** — cada cuenta llega a `quota 0` (`＄0.000000`) |
| Check-in diario | **deshabilitado** (`签到功能未启用`) — sin recarga |
| Modelos a precio cero | **ninguno** — `/api/pricing` (129 filas, leído con una sesión de cuenta) lista 0 modelos a precio cero |
| Captcha en el registro | **ninguno** (`turnstile_check: false`) |
| Correo electrónico que acepta el panel | `@gmail.com` simple (forma sin puntos); `@qq.com` es rechazado (`550 … non-existent account`); envía vía `1449683658@qq.com` (asunto `量界智算邮箱验证邮件`) — fíjalo con `--sender "1449683658\|量界智算"` |
| Qué puede hacer hoy una clave generada | `GET /v1/models` **200** (97 modelos) — auténtica; `POST /v1/chat/completions` **403** `insufficient_user_quota` hasta que se financie |
| La unidad que escala | **una cuenta = una clave** → `--count N` en realidad significa "N cuentas, cada una con su propio saldo" |

> 💡 El nivel gratuito lo define liangjiewis.com y puede cambiar. Consulta los números en vivo en [liangjiewis.com](https://liangjiewis.com) — y deja que la propia verificación de la herramienta decida:

```bash
node src/cli.js verify                 # every key in keys.txt is re-tested against the live API
```

## 🤖 Modelos — los 97

`GET https://liangjiewis.com/v1/models` devuelve **97 ids de modelo** para una clave generada, por ejemplo:

```
claude-opus-5 · claude-sonnet-5 · claude-haiku-4-5-20251001 · claude-3-5-haiku-20241022
gpt-5.5 · gpt-5.4-mini · gpt-5.1-codex-max · gpt-5-codex · gemini-3-pro-preview
gemini-2.5-flash · gemini-3.1-flash-lite-preview · o3 · o3-mini · o4-mini
text-embedding-3-small
```

**Qué responde una cuenta nueva cuando intenta *usar* un modelo** — medido en cada clave: `POST /v1/chat/completions` responde `403` `{"error":{"message":"用户额度不足, 剩余额度: ＄0.000000 (request id: …)","type":"new_api_error","code":"insufficient_user_quota"}}` — así que ningún id tiene un chat-200 y la tabla de marcas permanece vacía. Recarga la cuenta y la misma clave sirve tráfico sin regenerar.

## 🧪 Cómo usar la API

La URL base es **`https://liangjiewis.com/v1`** — compatible con OpenAI, así que cualquier cosa que hable OpenAI funciona (SDKs, Cursor, OpenCode, Kilo Code, …).

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

Hasta que la cuenta se financie, esto responde `403 insufficient_user_quota` — el rechazo es el saldo de la cuenta, no un defecto de la clave.

## 🛠 Inicio rápido

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

Las claves se añaden a `keys.txt`, una por línea, una vez que una clave ha respondido `GET /v1/models` 200 *y* ha vuelto una llamada a un modelo para ella — en una cuenta nueva aquí esa llamada es el rechazo por crédito, que se registra exactamente como tal y no retiene la clave. Las cuentas se ejecutan una tras otra; `--count 10` es una ejecución larga, y `out/pinned-<date>.log` es el registro continuo de la misma. No se envía nada al panel que no pase por una salida de `proxies.txt`.

### 🖱️ El lanzador

```bash
node src/launcher.js
```

Un menú sobre los módulos de tareas: **mint**, **verify**, **9Router**. Pide `count` (claves por ejecución) y `parallel exits`, los guarda en `launcher.config.json`, y lanza `node src/cli.js <task>` con las banderas correctas. El elemento de menú **6** ejecuta directamente el registro en 9Router.

## ✅ Verificado y funcionando — cada clave se prueba

Medido el **2026-10-15**: **3 cuentas → 3 claves, una clave por cuenta**. Cada clave se comprobó después de existir, en una salida *independiente* de la generación, y cada clave se volvió a comprobar más tarde el mismo día.

| Modelo | En vivo (models) | Llamada de chat real | Medido |
| --- | --- | --- | --- |
| `claude-3-5-haiku-20241022` | **200** · 97 modelos | **403** `insufficient_user_quota` (`＄0.000000`) · ✔ **en vivo** (recomprobado 13:11) | 2026-10-15 12:33 |

**Las tres estaban en vivo tal como se escribió** — recomprobadas el 2026-10-15 13:11 UTC con el propio `src/verify.js`: **3/3 claves respondieron `GET /v1/models` 200** (97 modelos cada una, cada una en una salida nueva — ninguna la de la generación), **3/3 sin crédito** (`403 insufficient_user_quota`). `GET /v1/models` 200 demuestra que una clave es *auténtica*; la columna de completions muestra qué puede *gastar* una cuenta nueva. `node src/cli.js verify` reproduce la comprobación para tu propio archivo.

## 🧭 Cómo funciona

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: liangjiewis.com page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://liangjiewis.com/v1/chat/completions → real content = the key is live
```

| Paso | Llamada | Notas |
| --- | --- | --- |
| Barreras | `GET /api/status` | `email_verification: true` · `turnstile_check: false` · `checkin_enabled: false` · Gmail aceptado (forma simple) |
| Buzón | [Emailnator](https://www.emailnator.com) | una dirección de Gmail nueva por cuenta, leída a través de tus salidas |
| Enviar código | `GET /api/verification?email=<plain>` | `{"success":true}` |
| Registro | `POST /api/user/register` | `{"success":true}` |
| Inicio de sesión | `POST /api/user/login` | cookie de sesión + `GET /api/user/self` → `quota: 0` |
| Token | `POST /api/token/` | una clave por cuenta |
| Check-in | `POST /api/user/checkin` | `{"success":false,"message":"签到功能未启用"}` — informa correctamente que está deshabilitado; sin crédito |
| Probar | `GET /v1/models` + `POST /v1/chat/completions` | ambos registrados con la salida observadora; el rechazo del chat aquí es la *barrera de crédito*, no un defecto de la clave |

## ⚙️ Opciones de CLI

Todo el código vive en `src/` — ejecútalo desde la raíz del repositorio como `node src/<file>.js`.

| Herramienta | Banderas |
| --- | --- |
| `src/mint.js` | `--count N` (3) · `--pool FILE` (`proxies.txt`) · `--mail emailnator\|imap` · `--imap-user` / `--imap-pass` (o `IMAP_USER` / `IMAP_PASS`) · `--mail-address` · `--sender REGEX` (por defecto `1449683658\|量界智算`) · `--model ID` · `--poll-ms` (2000) · `--code-wait` (300000) · `--max-cycle` (3) · `--scan` (200) · `--scan-conc` (8, máx 8) · `--budget` (2400 s) · `--base URL` |
| `src/verify.js` | `--key K` · `--all` · `--model ID` · `--max-tokens` (8) · `--want` (3) · `--pool FILE` · `--base URL` |
| `src/launcher.js` | interactivo: mint / verify / settings — `count` y `concurrency` persisten en `launcher.config.json` |

## 🛰️ Detrás de un proxy

* Las salidas provienen de `proxies.txt` (una línea por salida, `scheme://host:port`, se admite `user:pass@`, los comentarios `#` se ignoran). El mismo pool alimenta las llamadas al panel, la verificación de claves y las lecturas del buzón; las herramientas nunca marcan directamente al proveedor.
* **El filtrado es el trabajo.** Cada cuenta fija la primera salida que demuestra `GET /api/status` contra el host del panel, y la verificación fija una salida *diferente* ya probada — una salida muerta se retira sola y la cuenta continúa con la siguiente.
* El buzón ([Emailnator](https://www.emailnator.com)) es un servicio de correo temporal de terceros en lugar del panel; su API también se lee a través de tus salidas.
* El correo de verificación llega desde **`1449683658@qq.com`** (`量界智算邮箱验证邮件`) — no desde el dominio del panel — por lo que el `--sender` por defecto fija ese remitente para que el código de un desconocido en un buzón compartido nunca pueda enviarse.

## 📄 Archivos

| Ruta | Contenido |
| --- | --- |
| `keys.txt` | una clave verificada en vivo por línea — ignorada por git |
| `accounts.json` | buzón, pasos, check-in, ambas salidas de verificación por cuenta — ignorado por git |
| `models.json` | una captura nueva de `/v1/models` por ejecución — ignorado por git |
| `proxies.txt` | tus salidas, una por línea — ignorado por git |
| `out/pinned-<date>.log` | el registro por ejecución (salida, tiempos, respuesta exacta del servidor) — ignorado por git |
| `src/mint.js` · `src/verify.js` | los dos motores a los que despacha la CLI |
| `src/connect-9router.js` | registra las claves de `keys.txt` como conexiones de 9Router |

## 🔌 Conectar con 9Router

[9Router](https://9router.com) es un router autoalojado y compatible con OpenAI. liangjiewis.com es compatible con OpenAI, así que regístralo una vez y usa todas las claves:

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
# or: node src/cli.js mint --count 3 --connect-9router
```

Cada clave en `keys.txt` se convierte en una conexión del nodo proveedor `liangjiewis` (`--api-key <key>` registra una sola clave en su lugar, `--model <id>` sobrescribe el valor por defecto). Luego elige un modelo dentro de 9Router:

```
liangjiewis/claude-3-5-haiku-20241022
liangjiewis/claude-opus-5
liangjiewis/gpt-5.5
```

Valores por defecto: `--base http://localhost:20128`, `--password 123456`, `--prefix liangjiewis`, `--base-url https://liangjiewis.com/v1`, modelo por defecto `claude-3-5-haiku-20241022`.

## 🔑 Qué te da una clave

| | |
| --- | --- |
| 🏢 Proveedor | **liangjiewis.com** — [liangjiewis.com](https://liangjiewis.com) |
| 🎁 Qué ofrece el proveedor | 97 modelos listados (Claude Opus 5, GPT-5.5, Gemini 3 Pro, O3) — claves auténticas, inferencia limitada por crédito |
| 🔑 Qué te da una clave | una clave API limitada a su propia cuenta: los 97 ids de modelo en el endpoint de abajo, con los límites de tu plan. La cuota vive en la **cuenta**, que es exactamente por lo que esta herramienta crea una cuenta por clave |
| 🌐 Forma de la API | Compatible con OpenAI: `POST https://liangjiewis.com/v1/chat/completions` |
| 🔒 Tus datos | solo se contacta a liangjiewis.com y al backend de buzón que configures; las claves permanecen en tu máquina |

## 🐞 Problemas

Abre un issue con el paso que falla y el final del registro de ejecución (`out/pinned-<date>.log`) — contiene la salida, los tiempos y la respuesta exacta del servidor, que es todo lo necesario para reproducir un fallo. Nunca adjuntes una clave. **[Abre un issue](../../issues)** y las PRs son bienvenidas.

## 📄 Licencia

MIT © 2026 — consulta [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 liangjiewis-bulk-apikey contributors

</div>