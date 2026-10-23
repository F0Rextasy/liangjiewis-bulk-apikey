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

**批量创建 liangjiewis.com 账户并自动生成 API 密钥 — OpenAI 兼容推理（Claude、GPT、Gemini、DeepSeek、GLM、Qwen）+ 9Router 连接器。**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-97%20served-412991?style=for-the-badge)](https://liangjiewis.com)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 快速开始](#-quick-start) · [🎁 免费额度](#-free-tier--how-much-you-get) · [🤖 模型](#-models--all-97-of-them) · [🧪 使用 API](#-how-to-use-the-api) · [✅ 已验证](#-verified-working--every-key-is-tested) · [🧭 工作原理](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ 选项](#️-cli-options) · [🛰️ 代理](#️-behind-a-proxy) · [🐞 问题反馈](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ 为什么会有这个项目

liangjiewis.com（量界智算）列出了 **97 个模型**，注册仅需邮箱验证 — **无验证码**（`turnstile_check: false`）。新账户初始为 **`quota 0`（`＄0.000000`）**，**无每日签到**（`签到功能未启用`），且在其 129 行定价表中 **0 个零价模型**，因此每个生成的密钥都是*真实有效的*（`GET /v1/models` **200**）且*受额度限制的*（`POST /v1/chat/completions` **403** `insufficient_user_quota`）。一个账户对应一个密钥；N 个密钥 = N 个账户，每个账户有独立预算。

## 🎁 免费额度 — 你能获得多少

**新注册的 liangjiewis.com 账户没有额度 — 该工具生成的是真实密钥，但其账户仍需充值。**

| 项目 | 实测结果 |
| --- | --- |
| 注册赠送 | **无额度** — 每个账户初始为 `quota 0`（`＄0.000000`） |
| 每日签到 | **已禁用**（`签到功能未启用`）— 无补充 |
| 零价模型 | **无** — `/api/pricing`（129 行，使用账户会话读取）列出 0 个零价模型 |
| 注册验证码 | **无**（`turnstile_check: false`） |
| 面板接受的邮箱 | 普通 `@gmail.com`（无点形式）；`@qq.com` 被拒绝（`550 … non-existent account`）；通过 `1449683658@<mail>` 发送（主题 `量界智算邮箱验证邮件`）— 用 `--sender "1449683658\|量界智算"` 固定它 |
| 当前生成的密钥能做什么 | `GET /v1/models` **200**（97 个模型）— 真实有效；`POST /v1/chat/completions` **403** `insufficient_user_quota`，直到充值 |
| 可扩展的单位 | **一个账户 = 一个密钥** → `--count N` 实际上是“N 个账户，每个有独立余额” |

> 💡 免费额度由 liangjiewis.com 设定，可能变化。请在 [liangjiewis.com](https://liangjiewis.com) 查看实时数据 — 并让工具自身的验证来决定：

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 模型 — 全部 97 个

`GET https://liangjiewis.com/v1/models` 为生成的密钥返回 **97 个模型 ID**，例如：

```
claude-opus-5 · claude-sonnet-5 · claude-haiku-4-5-20251001 · claude-3-5-haiku-20241022
gpt-5.5 · gpt-5.4-mini · gpt-5.1-codex-max · gpt-5-codex · gemini-3-pro-preview
gemini-2.5-flash · gemini-3.1-flash-lite-preview · o3 · o3-mini · o4-mini
text-embedding-3-small
```

**新账户尝试*使用*模型时的响应** — 对每个密钥实测，原文引用以便你确切知道会得到什么：

| 调用 | 状态 | 响应体 |
| --- | --- | --- |
| `POST /v1/chat/completions`（`claude-3-5-haiku-20241022`，列表中最低价的 ID） | **403** | `{"error":{"message":"用户额度不足, 剩余额度: ＄0.000000 (request id: …)","type":"new_api_error","code":"insufficient_user_quota"}}` |

为账户充值后，同一密钥即可正常服务，无需重新生成。

## 🧪 如何使用 API

基础 URL 为 **`https://liangjiewis.com/v1`** — OpenAI 兼容，因此任何支持 OpenAI 的工具都可以使用（SDK、Cursor、OpenCode、Kilo Code 等）。

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

在账户充值之前，这会返回 `403 insufficient_user_quota` — 该拒绝是账户余额所致，而非密钥本身的缺陷。

## 🛠 快速开始

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

密钥在通过 `GET /v1/models` 200 *且*模型调用有响应后，会追加到 `keys.txt`，每行一个 — 在此处的新账户上，该调用是额度拒绝，会被如实记录，且不会扣留密钥。账户依次运行；`--count 10` 是一次长时间运行，`out/pinned-<date>.log` 是其运行记录。任何未经过 `proxies.txt` 中出口的请求都不会发送到面板。

### 🖱️ 启动器

```bash
node src/launcher.js
```

一个覆盖任务模块的菜单：**mint**、**verify**、**9Router**。它会询问 `count`（每次运行的密钥数）和 `parallel exits`，将它们保存在 `launcher.config.json` 中，并以正确的标志启动 `node src/cli.js <task>`。菜单项 **6** 直接运行 9Router 注册。

## ✅ 已验证可用 — 每个密钥都经过测试

实测于 **2026-10-15**：**每个账户生成了自己的密钥，一个账户一个密钥**。每个密钥在生成后都经过检查，使用与生成时*独立*的出口，且每个密钥都在当天稍后重新检查。

| 模型 | 在线（模型） | 真实聊天调用 | 实测时间 |
| --- | --- | --- | --- |
| `claude-3-5-haiku-20241022` | **200** · 97 个模型 | **403** `insufficient_user_quota`（`＄0.000000`）· ✔ **在线**（13:11 重新检查） | 2026-10-15 09:41 |
| `claude-3-5-haiku-20241022` | **200** · 97 个模型 | **403** `insufficient_user_quota`（`＄0.000000`）· ✔ **在线**（13:11 重新检查） | 2026-10-15 09:42 |
| `claude-3-5-haiku-20241022` | **200** · 97 个模型 | **403** `insufficient_user_quota`（`＄0.000000`）· ✔ **在线**（13:11 重新检查） | 2026-10-15 12:33 |

**三个密钥均如记录所示在线** — 于 2026-10-15 13:11 UTC 使用 `src/verify.js` 本身重新检查：**每个密钥都返回 `GET /v1/models` 200**（各 97 个模型，每个使用全新出口 — 均非生成时的出口），**3/3 额度不足**（`403 insufficient_user_quota`）。`GET /v1/models` 200 证明密钥*真实有效*；补全列显示新账户能*花费*什么。`node src/cli.js verify` 可为你自己的文件重现该检查。

> **质量门禁。** 此处的每个密钥在写入 `keys.txt` 之前都通过了实时 `chat-200`
> （失效密钥绝不发布）。路由组合在模型层面遵循相同规则：仅当模型返回 `chat-200` 且能调用工具时，
> 才会添加条目 — 不支持工具的模型、失效密钥或失效提供商会被丢弃而非添加。可随时重新运行验证步骤；
> 失败会被报告，绝不隐藏。

## 🧭 工作原理

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: liangjiewis.com page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://liangjiewis.com/v1/chat/completions → real content = the key is live
```

| 步骤 | 调用 | 说明 |
| --- | --- | --- |
| 门禁 | `GET /api/status` | `email_verification: true` · `turnstile_check: false` · `checkin_enabled: false` · 接受 Gmail（普通形式） |
| 邮箱 | [Emailnator](https://www.emailnator.com) | 每个账户一个全新 Gmail 地址，通过你的出口读取 |
| 发送验证码 | `GET /api/verification?email=<plain>` | `{"success":true}` |
| 注册 | `POST /api/user/register` | `{"success":true}` |
| 登录 | `POST /api/user/login` | 会话 cookie + `GET /api/user/self` → `quota: 0` |
| 令牌 | `POST /api/token/` | 每个账户一个密钥 |
| 签到 | `POST /api/user/checkin` | `{"success":false,"message":"签到功能未启用"}` — 正确报告已禁用；无额度 |
| 验证 | `GET /v1/models` + `POST /v1/chat/completions` | 两者都记录观察出口；此处的聊天拒绝是*额度门禁*，而非密钥缺陷 |

## ⚙️ CLI 选项

所有代码位于 `src/` — 从仓库根目录以 `node src/<file>.js` 运行。

| 工具 | 标志 |
| --- | --- |
| `src/mint.js` | `--count N` (3) · `--pool FILE` (`proxies.txt`) · `--mail emailnator\|imap` · `--imap-user` / `--imap-pass` (或 `IMAP_USER` / `IMAP_PASS`) · `--mail-address` · `--sender REGEX` (默认 `1449683658\|量界智算`) · `--model ID` · `--poll-ms` (2000) · `--code-wait` (300000) · `--max-cycle` (3) · `--scan` (200) · `--scan-conc` (8, 最大 8) · `--budget` (2400 s) · `--base URL` |
| `src/verify.js` | `--key K` · `--all` · `--model ID` · `--max-tokens` (8) · `--want` (3) · `--pool FILE` · `--base URL` |
| `src/launcher.js` | 交互式：mint / verify / settings — `count` 和 `concurrency` 持久化在 `launcher.config.json` 中 |

## 🛰️ 代理配置

**可选 — 大规模使用时推荐（每 IP 限制、封禁）。** 该工具无代理也可运行。

* **有代理池：** 传入 `--pool <file>`（或将出口放入 `proxies.txt`），每个请求都通过该列表中的出口 — 失效线路会使该次尝试失败，工具会转向下一个。
* **无代理池：** CLI 会打印 `running WITHOUT a proxy (direct)` 并直接连接。注册、密钥生成或验证没有任何变化 — 只是数据包发出的位置不同。

* 出口来自 `proxies.txt`（每行一个出口，`scheme://host:port`，支持 `user:pass@`，忽略 `#` 注释）。提供代理池时，同一池会供给面板调用、密钥验证和邮箱读取；无代理池时，工具直接连接。
* **筛选是关键工作。** 每个账户固定使用第一个对面板主机证明 `GET /api/status` 成功的出口，验证则固定使用*不同的*已验证出口 — 失效出口会自行退役，账户继续使用下一个。
* 邮箱（[Emailnator](https://www.emailnator.com)）是第三方临时邮箱服务而非面板；提供代理池时，其 API 也通过你的出口读取。
* 验证邮件来自 **`1449683658`**（`量界智算邮箱验证邮件`）— 而非面板域名 — 这就是默认 `--sender` 固定该发件人的原因，确保共享邮箱中陌生人的验证码绝不会被提交。

## 📄 文件

| 路径 | 内容 |
| --- | --- |
| `keys.txt` | 每行一个实时验证的密钥 — 已被 git 忽略 |
| `accounts.json` | 每个账户的邮箱、步骤、签到、两个验证出口 — 已被 git 忽略 |
| `models.json` | 每次运行的全新 `/v1/models` 捕获 — 已被 git 忽略 |
| `proxies.txt` | 你的出口，每行一个 — 已被 git 忽略 |
| `out/pinned-<date>.log` | 每次运行的日志（出口、时间、服务器确切响应）— 已被 git 忽略 |
| `src/mint.js` · `src/verify.js` | CLI 调度的两个引擎 |
| `src/connect-9router.js` | 将 `keys.txt` 中的密钥注册为 9Router 连接 |

## 🔌 连接到 9Router

[9Router](https://9router.com) 是一个自托管的 OpenAI 兼容路由器。liangjiewis.com 是 OpenAI 兼容的，因此注册一次即可使用所有密钥：

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
# or: node src/cli.js mint --count 3 --connect-9router
```

`keys.txt` 中的每个密钥都会成为 `liangjiewis` 提供商节点的一个连接（`--api-key <key>` 改为注册单个密钥，`--model <id>` 覆盖默认值）。然后在 9Router 中选择模型：

```
liangjiewis/claude-3-5-haiku-20241022
liangjiewis/claude-opus-5
liangjiewis/gpt-5.5
```

默认值：`--base http://localhost:20128`、`--password 123456`、`--prefix liangjiewis`、`--base-url https://liangjiewis.com/v1`，默认模型 `claude-3-5-haiku-20241022`。

## 🔌 连接到 OmniRoute

[OmniRoute](https://omniroute.online) 是一个自托管的 OpenAI 兼容路由器。liangjiewis.com 是 OpenAI 兼容的，因此注册一次即可使用所有密钥：

```bash
node src/connect-omniroute.js --base http://localhost:20128 --password 123456
# or: node src/cli.js mint --count 3 --connect-omniroute
```

`keys.txt` 中的每个密钥都会成为 `liangjiewis` 提供商节点的一个连接（`--api-key <key>` 改为注册单个密钥，`--model <id>` 覆盖默认值）。然后在 OmniRoute 中选择模型：

```
liangjiewis/claude-3-5-haiku-20241022
liangjiewis/claude-opus-5
liangjiewis/gpt-5.5
```

默认值：`--base http://localhost:20128`、`--password 123456`、`--prefix liangjiewis`、`--base-url https://liangjiewis.com/v1`，默认模型 `claude-3-5-haiku-20241022`。

## 🔑 一个密钥能给你什么

| | |
| --- | --- |
| 🏢 提供商 | **liangjiewis.com** — [liangjiewis.com](https://liangjiewis.com) |
| 🎁 提供商提供什么 | 列出 97 个模型（Claude Opus 5、GPT-5.5、Gemini 3 Pro、O3）— 密钥真实有效，推理受额度限制 |
| 🔑 一个密钥能给你什么 | 一个绑定其自身账户的 API 密钥：下方端点上的 97 个模型 ID，受你的套餐限制。额度存在于**账户**上，这正是该工具为每个密钥创建一个账户的原因 |
| 🌐 API 形式 | OpenAI 兼容：`POST https://liangjiewis.com/v1/chat/completions` |
| 🔒 你的数据 | 仅联系 liangjiewis.com 和你配置的邮箱后端；密钥保留在你的机器上 |

## 🐞 问题反馈

提交 issue 时请附上失败的步骤和运行日志尾部（`out/pinned-<date>.log`）— 它包含出口、时间和服务器确切响应，这是重现问题所需的一切。切勿附上密钥。**[提交 issue](../../issues)**，欢迎 PR。

## 📄 许可证

MIT © 2026 — 见 [LICENSE](LICENSE)。

<div align="center">

**[MIT](LICENSE)** © 2026 liangjiewis-bulk-apikey contributors

</div>