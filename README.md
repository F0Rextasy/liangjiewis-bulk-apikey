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

**Bulk API keys for [liangjiewis.com](https://liangjiewis.com) (量界智算) — 97 models listed, one account per key. Every key is verified live — `GET /v1/models` 200 on an exit other than the mint's — before it lands in `keys.txt`; the keys are real, and inference is gated by the account's credit (read the note below).**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-97%20listed-d97706?style=for-the-badge)](https://liangjiewis.com)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Quick start](#-quick-start) · [✅ Verified](#-verified-authentic--credit-gated) · [🤖 Models & free tier](#-models--free-tier) · [⚙️ Options](#️-options) · [🛰️ Proxies](#️-behind-a-proxy) · [🐞 Issues](#-issues)

</div>

---

> **One account, one key.** N accounts → N keys, one sign-up each, every key verified live
> before it lands in `keys.txt` — `GET /v1/models` must answer 200 for it on an exit other
> than the one that minted it.

> **The keys are real; inference is gated by credits.** Sign-up grants **no credit**: every
> account lands at `quota 0` (`＄0.000000`), the pricing table carries no zero-price model,
> and the daily check-in is off (`签到功能未启用`). Until the account is topped up, every
> completion answers `403 insufficient_user_quota` — that refusal is the account's balance,
> not a defect of the key. Fund the account and the same key serves traffic with no
> re-mint.

## ✨ What this does

* **One account per key, any number you want.** `--count N` (default 3) mints N fresh
  accounts and appends one key per line to `keys.txt`.
* **No mailbox to set up.** Every account gets its own fresh gmail address from
  [Emailnator](https://www.emailnator.com), which is the form this panel accepts; the
  verification mail is read over your exits, so the sign-up runs unattended
  (`email_verification = true`).
* **No captcha step.** The panel's own gates report `turnstile_check = false`, so the
  sign-up is plain HTTP from start to finish.
* **Keys are verified, not assumed.** Each key is checked on `GET /v1/models` (its own
  host, an exit other than the mint's) *and* probed with a real completion, so you know
  exactly what a key is worth today — an authentic key whose account still needs credit,
  or a key that spends right away.
* **Everything lands on disk.** `keys.txt` (one key per line), `accounts.json` (mailbox,
  steps, check-in, both exits, the current verdict and the one taken at mint time),
  `models.json`, and a per-run log in `out/`.

## 🛠 Quick start

```bash
git clone https://github.com/F0Rextasy/liangjiewis-bulk-apikey.git
cd liangjiewis-bulk-apikey

# 1) your proxy list, one exit per line (http://, socks5://, socks4:// or bare host:port)
printf 'socks5://127.0.0.1:1080\n' > proxies.txt

# 2) go
node launcher.js                         # interactive: mint / verify / settings
# or drive it directly:
node cli.js mint --count 3               # any N; 3 is the sample default
node cli.js mint --count 10 --scan-conc 8
node cli.js verify                       # re-check every key in keys.txt
node cli.js help                         # task list
node mint.js --help                      # the flags mint actually reads
```

Keys are appended to `keys.txt`, one per line, once a key has answered `GET /v1/models`
200 *and* a model call has come back for it — on a fresh account here that call is the
credit refusal, which is recorded as exactly that and does not withhold the key. Accounts
run one after another; `--count 10` is a long run, and `out/pinned-<date>.log` is the
running record of it. Nothing is sent to the panel that does not go through an exit from
`proxies.txt` — a call with no exit left raises instead of dialing out directly.

## ✅ Verified: authentic + credit-gated

Measured **2026-10-15**: **3 accounts → 3 keys, one key per account**. Every key was checked
after it existed, on an exit *independent* of the mint, and every key was re-checked later
the same day:

| model | live (test) | real chat call | measured |
|---|---|---|---|
| `claude-3-5-haiku-20241022` | **200** · 97 models | **403** `insufficient_user_quota` (`＄0.000000`) · ✔ **live** (re-checked 13:11) | 2026-10-15 09:41 |
| `claude-3-5-haiku-20241022` | **200** · 97 models | **403** `insufficient_user_quota` (`＄0.000000`) · ✔ **live** (re-checked 13:11) | 2026-10-15 09:42 |
| `claude-3-5-haiku-20241022` | **200** · 97 models | **403** `insufficient_user_quota` (`＄0.000000`) · ✔ **live** (re-checked 13:11) | 2026-10-15 12:33 |

**All three were live as this was written** — re-checked 2026-10-15 13:11 UTC with
`verify.js` itself: **3/3 keys answered `GET /v1/models` 200** (97 models each, each on a
fresh exit — none the mint's), **3/3 out of credit** (`403 insufficient_user_quota`).
None refused, none left unmeasured. The middle columns are the point: `/v1/models` 200
proves a key is *authentic*, and the completion column shows exactly what a fresh account
can *spend* — here, nothing until it is funded, and the tool records that state per key
instead of guessing.

`node cli.js verify` reproduces the check for your own file, and no key that fails
verification is ever written. A key is never committed — `keys.txt` is git-ignored and is
where your own keys land.

## 🤖 Models & free tier

`GET /v1/models` returns **97 model ids** for a minted key, for example:

```
claude-opus-5 · claude-sonnet-5 · claude-haiku-4-5-20251001 · claude-3-5-haiku-20241022
gpt-5.5 · gpt-5.4-mini · gpt-5.1-codex-max · gpt-5-codex · gemini-3-pro-preview
gemini-2.5-flash · gemini-3.1-flash-lite-preview · o3 · o3-mini · o4-mini
text-embedding-3-small
```

**What a fresh account holds** — read off the panel's own gates and the accounts in the
table above:

| item | measured |
|---|---|
| sign-up grant | **no credit** — every account lands at `quota 0` (`＄0.000000`) |
| daily check-in | **disabled** (`签到功能未启用`) |
| zero-price models | **none** — `/api/pricing` (129 rows, read with an account session) lists 0 zero-price model |
| captcha at sign-up | **none** (`turnstile_check: false`) |
| e-mail the panel accepts | plain `@gmail.com` (the dot-free form of the address) |

**What a fresh account answers when it tries to *use* a model** — measured on every key in
the table above, quoted so you know exactly what you will get:

| call | status | body |
|---|---|---|
| `POST /v1/chat/completions` (`claude-3-5-haiku-20241022`, the cheapest listed id) | **403** | `{"error":{"message":"用户额度不足, 剩余额度: ＄0.000000 (request id: …)","type":"new_api_error","code":"insufficient_user_quota"}}` |

**What unlocks inference:** credit on the account. The relay is OpenAI-compatible
(`https://liangjiewis.com/v1`), so any client works the moment the account is funded — the
keys minted here need no change. **Want more of it?** One account per key, and the balance
is per account: N keys = N accounts, each with its own budget.

## ⚙️ Options

| tool | flags |
|---|---|
| `mint.js` | `--count N` (3) · `--pool FILE` (`proxies.txt`) · `--mail emailnator\|imap` · `--imap-user` / `--imap-pass` (or `IMAP_USER` / `IMAP_PASS`) · `--mail-address` · `--sender REGEX` (default: the panel's own mail sender; `--sender none` accepts any) · `--model ID` · `--poll-ms` (2000) · `--code-wait` (300000) · `--max-cycle` (3) · `--scan` (200) · `--scan-conc` (8, max 8) · `--budget` (2400 s) · `--base URL` |
| `verify.js` | `--key K` · `--all` · `--model ID` · `--max-tokens` (8) · `--want` (3) · `--pool FILE` · `--base URL` |
| `launcher.js` | interactive: mint / verify / settings — `count` (keys per run) and `conc` (parallel exit probes) persist in `launcher.config.json` |

`--count` controls how many keys one run produces; the credit is per account, so N keys are
N accounts. `--scan` / `--scan-conc` control how much of your exit list is probed per
pinned exit — raise `--scan` on a stale list, lower it on a small one.

`verify.js` writes its verdicts to `accounts.json` — the current one under `verify`
(`status`, `verdict`, `exit`, `at`), the measurement taken when the key was minted kept
under `verify.atMint` — so "the key works" is never confused with "this session works",
and a key no exit could be measured on says `error` (unmeasured) instead of reading as
dead.

## 🛰️ Behind a proxy

* Exits come from `proxies.txt` (one line per exit, `scheme://host:port`, `user:pass@`
  supported, `#` comments ignored). The same pool feeds the panel calls, the key
  verification and the mailbox reads; the tools never dial the provider directly — with no
  exit left they raise instead.
* **Screening is the work.** Each account pins the first exit that proves
  `GET /api/status` against the panel host, and verification pins a *different* proven
  exit — an exit that dies mid-run retires itself and the account continues on the next one.
* The mailbox is [Emailnator](https://www.emailnator.com), a third-party temp-mail service
  rather than the panel; its API is read through your exits as well. `--mail imap` switches
  to a mailbox you own instead.
* The batch was measured against `https://liangjiewis.com`; `--base URL` points the tools
  at another host should the panel move.

## 🐞 Issues

Open an issue with the failing step and the run log tail (`out/pinned-<date>.log`, or
`out/verify.log` for verification) — it carries the exit, the timing and the exact server
answer, which is everything needed to reproduce a miss. Never attach a key.

## 📄 License

MIT — see [LICENSE](LICENSE). Use it on accounts you are allowed to create.

---

<div align="center">

**Built by F0REXTASY** · [github.com/F0Rextasy](https://github.com/F0Rextasy) · [x.com/bigbullapp](https://x.com/bigbullapp)

</div>
