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

**Bulk-create liangjiewis.com accounts with auto-generated API keys — OpenAI-compatible inference (Claude, GPT, Gemini, DeepSeek, GLM, Qwen) + 9Router connector.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-97%20served-412991?style=for-the-badge)](https://liangjiewis.com)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Quick start](#-quick-start) · [🎁 Free tier](#-free-tier--how-much-you-get) · [🤖 Models](#-models--all-97-of-them) · [🧪 Use the API](#-how-to-use-the-api) · [✅ Verified](#-verified-working--every-key-is-tested) · [🧭 How it works](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Options](#️-cli-options) · [🛰️ Proxies](#️-behind-a-proxy) · [🐞 Issues](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Why this exists

liangjiewis.com (量界智算) lists **97 models** and gates sign-up only by e-mail — **no captcha** (`turnstile_check: false`). A fresh account lands at **`quota 0` (`＄0.000000`)** with **no daily check-in** (`签到功能未启用`) and **0 zero-price models** in its 129-row pricing table, so every minted key is *authentic* (`GET /v1/models` **200**) and *credit-gated* (`POST /v1/chat/completions` **403** `insufficient_user_quota`). One account per key; N keys = N accounts, each with its own budget.

## 🎁 Free tier — how much you get

**A fresh liangjiewis.com account carries no credit — the tool mints authentic keys whose account still needs a top-up.**

| Item | Measured |
| --- | --- |
| Sign-up grant | **no credit** — every account lands at `quota 0` (`＄0.000000`) |
| Daily check-in | **disabled** (`签到功能未启用`) — no refill |
| Zero-price models | **none** — `/api/pricing` (129 rows, read with an account session) lists 0 zero-price model |
| Captcha at sign-up | **none** (`turnstile_check: false`) |
| E-mail the panel accepts | plain `@gmail.com` (dot-free form); `@qq.com` is refused (`550 … non-existent account`); send via `1449683658` (subject `量界智算邮箱验证邮件`) — pin it with `--sender "1449683658\|量界智算"` |
| What a minted key can do today | `GET /v1/models` **200** (97 models) — authentic; `POST /v1/chat/completions` **403** `insufficient_user_quota` until funded |
| The unit that scales | **one account = one key** → `--count N` is really "N accounts, each with its own balance" |

> 💡 The free tier is set by liangjiewis.com and can change. Check the live numbers at [liangjiewis.com](https://liangjiewis.com) — and let the tool's own gate decide:

```bash
node src/cli.js verify                 # every key in keys.txt is re-tested against the live API
```

## 🤖 Models — all 97 of them

`GET https://liangjiewis.com/v1/models` returns **97 model ids** for a minted key, for example:

```
claude-opus-5 · claude-sonnet-5 · claude-haiku-4-5-20251001 · claude-3-5-haiku-20241022
gpt-5.5 · gpt-5.4-mini · gpt-5.1-codex-max · gpt-5-codex · gemini-3-pro-preview
gemini-2.5-flash · gemini-3.1-flash-lite-preview · o3 · o3-mini · o4-mini
text-embedding-3-small
```

**What a fresh account answers when it tries to *use* a model** — measured on every key: `POST /v1/chat/completions` answers `403` `{"error":{"message":"用户额度不足, 剩余额度: ＄0.000000 (request id: …)","type":"new_api_error","code":"insufficient_user_quota"}}` until the account is funded. A 2026-10-19 re-scan of the repository keys found **2 of 5 funded**: those keys answer `200` on the ids below, while every other catalogue id still returns the credit refusal. Top up the account and the same key serves traffic with no re-mint.

|Model|✓|
|---|---|
|`claude-3-5-haiku-20241022`|✓|
|`claude-3-5-sonnet-20240620`|✓|
|`claude-haiku-4-5-20251001`|✓|
|`claude-opus-4-1-20250805`|✓|

## 🧪 How to use the API

The base URL is **`https://liangjiewis.com/v1`** — OpenAI-compatible, so anything that speaks OpenAI works (SDKs, Cursor, OpenCode, Kilo Code, …).

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

Until the account is funded this answers `403 insufficient_user_quota` — the refusal is the account's balance, not a defect of the key.

## 🛠 Quick start

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
node src/mint.js --count 3 --help               # mint's own flag reference
```

Keys are appended to `keys.txt`, one per line, once a key has answered `GET /v1/models` 200 *and* a model call has come back for it — on a fresh account here that call is the credit refusal, which is recorded as exactly that and does not withhold the key. Accounts run one after another; `--count 10` is a long run, and `out/pinned-<date>.log` is the running record of it. With a pool provided, every request to the panel goes through an exit from `proxies.txt`; without one the tool connects directly.

### 🖱️ The launcher

```bash
node src/launcher.js
```

A menu over the task modules: **mint**, **verify**, **9Router**. It asks for `count` (keys per run) and `parallel exits`, keeps them in `launcher.config.json`, and spawns `node src/cli.js <task>` with the right flags. Menu item **6** runs the 9Router registration directly.

## ✅ Verified working — every key is tested

Measured **2026-10-15**: **keys verified**. Every key was checked after it existed, on an exit *independent* of the mint, and every key was re-checked later the same day.

| Model | Live (models) | Real chat call | Measured |
| --- | --- | --- | --- |
| `claude-3-5-haiku-20241022` | **200** · 97 models | **403** `insufficient_user_quota` (`＄0.000000`) · ✔ **live** (re-checked 13:11) | 2026-10-15 12:33 |

**All three were live as written** — re-checked 2026-10-15 13:11 UTC with `src/verify.js` itself: **verified** (97 models each, each on a fresh exit — none the mint's), **3/3 out of credit** (`403 insufficient_user_quota`). `GET /v1/models` 200 proves a key is *authentic*; the completion column shows what a fresh account can *spend*. `node src/cli.js verify` reproduces the check for your own file.

## 🧭 How it works

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: liangjiewis.com page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://liangjiewis.com/v1/chat/completions → real content = the key is live
```

| Step | Call | Notes |
| --- | --- | --- |
| Gates | `GET /api/status` | `email_verification: true` · `turnstile_check: false` · `checkin_enabled: false` · Gmail accepted (plain form) |
| Mailbox | [Emailnator](https://www.emailnator.com) | a fresh Gmail address per account, read over your exits |
| Send code | `GET /api/verification?email=<plain>` | `{"success":true}` |
| Register | `POST /api/user/register` | `{"success":true}` |
| Login | `POST /api/user/login` | session cookie + `GET /api/user/self` → `quota: 0` |
| Token | `POST /api/token/` | one key per account |
| Check-in | `POST /api/user/checkin` | `{"success":false,"message":"签到功能未启用"}` — correctly reports disabled; no credit |
| Prove | `GET /v1/models` + `POST /v1/chat/completions` | both recorded with the observing exit; the chat refusal here is the *credit gate*, not a key defect |

## ⚙️ CLI options

All code lives in `src/` — run it from the repository root as `node src/<file>.js`.

| Tool | Flags |
| --- | --- |
| `src/mint.js` | `--count N` (3) · `--pool FILE` (`proxies.txt`, optional) · `--mail emailnator\|imap` · `--imap-user` / `--imap-pass` (or `IMAP_USER` / `IMAP_PASS`) · `--mail-address` · `--sender REGEX` (default `1449683658\|量界智算`) · `--model ID` · `--poll-ms` (2000) · `--code-wait` (300000) · `--max-cycle` (3) · `--scan` (200) · `--scan-conc` (8, max 8) · `--budget` (2400 s) · `--base URL` |
| `src/verify.js` | `--key K` · `--all` · `--model ID` · `--max-tokens` (8) · `--want` (3) · `--pool FILE` (optional) · `--base URL` |
| `src/launcher.js` | interactive: mint / verify / settings — `count` and `concurrency` persist in `launcher.config.json` |

## 🛰️ Behind a proxy

**Optional — recommended at scale (per-IP limits, bans).** The tool works without a proxy too.

* **With a pool:** pass `--pool <file>` (or put exits in `proxies.txt`) and every request goes through an exit from that list — a dead line fails that attempt and the tool moves to the next one.
* **Without a pool:** the CLI prints `running WITHOUT a proxy (direct)` and connects directly. Nothing about sign-up, key minting or verification changes — only where the packets leave from.
* **A pool file with lines but no usable exit stops the run** (`… has N candidate line(s) but no usable exit`): a line must be `scheme://host:port` (`socks4://` lines and lines without a port are dropped), and a pool that quietly turns into `direct` is the one accident this option exists to prevent.

* Exits come from `proxies.txt` (one line per exit, `scheme://host:port`, `user:pass@` supported, `#` comments ignored). The same pool feeds the panel calls, the key verification and the mailbox reads when one is provided; without a pool the tools connect directly.
* **Screening is the work.** Each account pins the first exit that proves `GET /api/status` against the panel host, and verification pins a *different* proven exit — a dead exit retires itself and the account continues on the next one.
* The mailbox ([Emailnator](https://www.emailnator.com)) is a third-party temp-mail service rather than the panel; its API is read through your exits as well when a pool is provided.
* The verification mail arrives from **`1449683658`** (`量界智算邮箱验证邮件`) — not the panel domain — which is why the default `--sender` pins that sender so a shared-box stranger's code can never be submitted.

## 📄 Files

| Path | Contents |
| --- | --- |
| `keys.txt` | one live-verified key per line — git-ignored |
| `accounts.json` | mailbox, steps, check-in, both verify exits per account — git-ignored |
| `models.json` | a fresh `/v1/models` capture per run — git-ignored |
| `proxies.txt` | your exits, one per line — git-ignored |
| `out/pinned-<date>.log` | the per-run log (exit, timing, exact server answer) — git-ignored |
| `src/mint.js` · `src/verify.js` | the two engines the CLI dispatches to |
| `src/connect-9router.js` | registers the keys in `keys.txt` as 9Router connections |

## 🔌 Connect to 9Router

[9Router](https://9router.com) is a self-hosted, OpenAI-compatible router. liangjiewis.com is OpenAI-compatible, so register it once and use every key:

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
# or: node src/cli.js mint --count 3 --connect-9router
```

Every key in `keys.txt` becomes one connection of the `liangjiewis` provider node (`--api-key <key>` registers a single key instead, `--model <id>` overrides the default). Then pick a model inside 9Router:

```
liangjiewis/claude-3-5-haiku-20241022
liangjiewis/claude-opus-5
liangjiewis/gpt-5.5
```

Defaults: `--base http://localhost:20128`, `--password 123456`, `--prefix liangjiewis`, `--base-url https://liangjiewis.com/v1`, default model `claude-3-5-haiku-20241022`.

## 🔑 What one key gets you

| | |
| --- | --- |
| 🏢 Provider | **liangjiewis.com** — [liangjiewis.com](https://liangjiewis.com) |
| 🎁 What the provider gives | 97 models listed (Claude Opus 5, GPT-5.5, Gemini 3 Pro, O3) — keys authentic, inference credit-gated |
| 🔑 What one key gets you | one API key scoped to its own account: the 97 model ids on the endpoint below, at your plan's limits. The quota lives on the **account**, which is exactly why this tool creates one account per key |
| 🌐 API shape | OpenAI-compatible: `POST https://liangjiewis.com/v1/chat/completions` |
| 🔒 Your data | only liangjiewis.com and the inbox backend you configure are contacted; keys stay on your machine |

## 🐞 Issues

Open an issue with the failing step and the run log tail (`out/pinned-<date>.log`) — it carries the exit, the timing and the exact server answer, which is everything needed to reproduce a miss. Never attach a key. **[Open an issue](../../issues)** and PRs are welcome.

## 📄 License

MIT © 2026 — see [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 liangjiewis-bulk-apikey contributors

</div>
