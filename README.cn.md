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

**批量创建 liangjiewis.com 账户并自动生成 API 密钥——兼容 OpenAI 的推理服务（Claude、GPT、Gemini、DeepSeek、GLM、Qwen）+ 9Router 连接器。**

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

## ✨ 为什么存在这个项目

liangjiewis.com（量界智算）列出 **97 个模型**，并且注册仅通过电子邮件把关——**没有验证码**（`turnstile_check: false`）。新账户初始为 **`quota 0`（`＄0.000000`）**，**没有每日签到**（`签到功能未启用`），其 129 行定价表中 **0 个零价格模型**，因此每个生成的密钥都是*真实*的（`GET /v1/models` **200**）且*受额度限制*（`POST /v1/chat/completions` **403** `insufficient_user_quota`）。一个账户对应一个密钥；N 个密钥 = N 个账户，各自拥有独立预算。

## 🎁 免费额度——你能获得多少

**全新的 liangjiewis.com 账户不携带任何额度——该工具生成的是真实密钥，但其账户仍需充值。**

| 项目 | 实测 |
| --- | --- |
| 注册赠送 | **无额度**——每个账户初始为 `quota 0`（`＄0.000000`） |
| 每日签到 | **已禁用**（`签到功能未启用`）——不会补充 |
| 零价格模型 | **无**——`/api/pricing`（129 行，使用账户会话读取）列出 0 个零价格模型 |
| 注册时验证码 | **无**（`turnstile_check: false`） |
| 面板接受的电子邮件 | 纯 `@gmail.com`（无点形式）；`@qq.com` 被拒绝（`550 … non-existent account`）；通过 `1449683658` 发送（主题 `量界智算邮箱验证邮件`）——用 `--sender "1449683658\|量界智算"` 固定它 |
| 目前生成的密钥能做什么 | `GET /v1/models` **200**（97 个模型）——真实；在充值前 `POST /v1/chat/completions` **403** `insufficient_user_quota` |
| 可扩展的单位 | **一个账户 = 一个密钥** → `--count N` 实际上是“N 个账户，每个都有自己的余额” |

> 💡 免费额度由 liangjiewis.com 设定，并可能变化。请在 [liangjiewis.com](https://liangjiewis.com) 查看实时数字——并让工具自身的校验来决定：

```bash
node src/cli.js verify                 # every key in keys.txt is re-tested against the live API
```

## 🤖 模型——全部 97 个

`GET https://liangjiewis.com/v1/models` 对生成的密钥返回 **97 个模型 ID**，例如：

```
claude-opus-5 · claude-sonnet-5 · claude-haiku-4-5-20251001 · claude-3-5-haiku-20241022
gpt-5.5 · gpt-5.4-mini · gpt-5.1-codex-max · gpt-5-codex · gemini-3-pro-preview
gemini-2.5-flash · gemini-3.1-flash-lite-preview · o3 · o3-mini · o4-mini
text-embedding-3-small
```

**新账户在尝试*使用*模型时会得到什么响应**——对每个密钥实测：`POST /v1/chat/completions` 返回 `403` `{"error":{"message":"用户额度不足, 剩余额度: ＄0.000000 (request id: …)","type":"new_api_error","code":"insufficient_user_quota"}}`，直到账户充值。2026-10-19 对仓库密钥的重新扫描发现 **5 个中有 2 个已充值**：这些密钥对下列 ID 返回 `200`，而其他所有目录 ID 仍返回额度拒绝。为账户充值后，同一个密钥无需重新生成即可提供服务。

|模型|✓|
|---|---|
|`claude-3-5-haiku-20241022`|✓|
|`claude-3-5-sonnet-20240620`|✓|
|`claude-haiku-4-5-20251001`|✓|
|`claude-opus-4-1-20250805`|✓|

## 🧪 如何使用 API

基础 URL 是 **`https://liangjiewis.com/v1`**——兼容 OpenAI，因此任何支持 OpenAI 的工具都能使用（SDK、Cursor、OpenCode、Kilo Code 等）。

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

在账户充值前，这会返回 `403 insufficient_user_quota`——该拒绝是账户余额所致，而非密钥缺陷。

## 🛠 快速开始

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

密钥会被追加到 `keys.txt`，每行一个；前提是该密钥已对 `GET /v1/models` 返回 200，*并且* 已为其完成一次模型调用——在这里的新账户上，该调用就是额度拒绝，系统会如实记录，且不会因此扣留密钥。账户会一个接一个运行；`--count 10` 是一次长时间运行，`out/pinned-<date>.log` 是其运行记录。任何发往面板的请求都不会绕过 `proxies.txt` 中的出口。

### 🖱️ 启动器

```bash
node src/launcher.js
```

一个覆盖任务模块的菜单：**mint**、**verify**、**9Router**。它会询问 `count`（每次运行的密钥数）和 `parallel exits`，将它们保存在 `launcher.config.json` 中，并使用正确的标志启动 `node src/cli.js <task>`。菜单项 **6** 直接运行 9Router 注册。

## ✅ 已验证可用——每个密钥都经过测试

实测于 **2026-10-15**：**3 个账户 → 3 个密钥，一个账户一个密钥**。每个密钥在生成后都经过了检查，使用的是与生成过程*独立*的出口，并且每个密钥都在当天晚些时候重新检查过。

| 模型 | 实时（模型） | 真实聊天调用 | 实测 |
| --- | --- | --- | --- |
| `claude-3-5-haiku-20241022` | **200** · 97 个模型 | **403** `insufficient_user_quota`（`＄0.000000`）· ✔ **可用**（13:11 重新检查） | 2026-10-15 12:33 |

**三者均如所述可用**——于 2026-10-15 13:11 UTC 使用 `src/verify.js` 本身重新检查：**3/3 个密钥对 `GET /v1/models` 返回 200**（每个均 97 个模型，且各自使用全新出口——都不是生成过程所用的出口），**3/3 额度不足**（`403 insufficient_user_quota`）。`GET /v1/models` 200 证明密钥是*真实的*；completion 列显示新账户能*花费*什么。`node src/cli.js verify` 可针对你自己的文件复现该检查。

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
| 门槛 | `GET /api/status` | `email_verification: true` · `turnstile_check: false` · `checkin_enabled: false` · 接受 Gmail（纯形式） |
| 邮箱 | [Emailnator](https://www.emailnator.com) | 每个账户一个全新的 Gmail 地址，通过你的出口读取 |
| 发送验证码 | `GET /api/verification?email=<plain>` | `{"success":true}` |
| 注册 | `POST /api/user/register` | `{"success":true}` |
| 登录 | `POST /api/user/login` | 会话 cookie + `GET /api/user/self` → `quota: 0` |
| 令牌 | `POST /api/token/` | 每个账户一个密钥 |
| 签到 | `POST /api/user/checkin` | `{"success":false,"message":"签到功能未启用"}`——正确报告为已禁用；无额度 |
| 验证 | `GET /v1/models` + `POST /v1/chat/completions` | 两者都记录观察出口；此处的聊天拒绝是*额度门槛*，而非密钥缺陷 |

## ⚙️ CLI 选项

所有代码位于 `src/`——请从仓库根目录以 `node src/<file>.js` 运行。

| 工具 | 标志 |
| --- | --- |
| `src/mint.js` | `--count N` (3) · `--pool FILE` (`proxies.txt`) · `--mail emailnator\|imap` · `--imap-user` / `--imap-pass`（或 `IMAP_USER` / `IMAP_PASS`） · `--mail-address` · `--sender REGEX`（默认 `1449683658\|量界智算`） · `--model ID` · `--poll-ms` (2000) · `--code-wait` (300000) · `--max-cycle` (3) · `--scan` (200) · `--scan-conc` (8，最大 8) · `--budget` (2400 s) · `--base URL` |
| `src/verify.js` | `--key K` · `--all` · `--model ID` · `--max-tokens` (8) · `--want` (3) · `--pool FILE` · `--base URL` |
| `src/launcher.js` | 交互式：mint / verify / settings——`count` 和 `concurrency` 持久保存在 `launcher.config.json` 中 |

## 🛰️ 通过代理运行

* 出口来自 `proxies.txt`（每行一个出口，支持 `scheme://host:port`、`user:pass@`，忽略 `#` 注释）。同一个池供面板调用、密钥验证和邮箱读取使用；工具从不直接连接提供商。
* **筛选就是关键工作。** 每个账户固定使用第一个能对面板主机证明 `GET /api/status` 的出口，而验证会固定使用一个*不同的*已验证出口——失效出口会自行淘汰，账户继续使用下一个。
* 邮箱（[Emailnator](https://www.emailnator.com)）是第三方临时邮件服务，而非面板；其 API 同样通过你的出口读取。
* 验证邮件来自 **`1449683658`**（`量界智算邮箱验证邮件`）——而非面板域名——这就是默认 `--sender` 固定该发件人的原因，这样共享邮箱中陌生人的验证码就永远不会被提交。

## 📄 文件

| 路径 | 内容 |
| --- | --- |
| `keys.txt` | 每行一个经实时验证的密钥——已被 git 忽略 |
| `accounts.json` | 每个账户的邮箱、步骤、签到、两个验证出口——已被 git 忽略 |
| `models.json` | 每次运行全新捕获的 `/v1/models`——已被 git 忽略 |
| `proxies.txt` | 你的出口，每行一个——已被 git 忽略 |
| `out/pinned-<date>.log` | 每次运行的日志（出口、时序、服务器确切响应）——已被 git 忽略 |
| `src/mint.js` · `src/verify.js` | CLI 分派到的两个引擎 |
| `src/connect-9router.js` | 将 `keys.txt` 中的密钥注册为 9Router 连接 |

## 🔌 连接到 9Router

[9Router](https://9router.com) 是一个自托管、兼容 OpenAI 的路由器。liangjiewis.com 兼容 OpenAI，因此注册一次即可使用所有密钥：

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
# or: node src/cli.js mint --count 3 --connect-9router
```

`keys.txt` 中的每个密钥都会成为 `liangjiewis` 提供商节点的一个连接（`--api-key <key>` 改为注册单个密钥，`--model <id>` 覆盖默认值）。然后在 9Router 内选择一个模型：

```
liangjiewis/claude-3-5-haiku-20241022
liangjiewis/claude-opus-5
liangjiewis/gpt-5.5
```

默认值：`--base http://localhost:20128`、`--password 123456`、`--prefix liangjiewis`、`--base-url https://liangjiewis.com/v1`，默认模型 `claude-3-5-haiku-20241022`。

## 🔑 一个密钥能给你什么

| | |
| --- | --- |
| 🏢 提供商 | **liangjiewis.com**——[liangjiewis.com](https://liangjiewis.com) |
| 🎁 提供商提供什么 | 列出 97 个模型（Claude Opus 5、GPT-5.5、Gemini 3 Pro、O3）——密钥真实，推理受额度限制 |
| 🔑 一个密钥能给你什么 | 一个作用域为其自身账户的 API 密钥：下方端点上的 97 个模型 ID，受你的套餐限制。额度存在于**账户**上，这正是该工具为每个密钥创建一个账户的原因 |
| 🌐 API 形态 | 兼容 OpenAI：`POST https://liangjiewis.com/v1/chat/completions` |
| 🔒 你的数据 | 仅联系 liangjiewis.com 和你配置的收件箱后端；密钥保留在你的机器上 |

## 🐞 问题

请提交 issue，并附上失败步骤和运行日志尾部（`out/pinned-<date>.log`）——其中包含出口、时序和服务器确切响应，这些是复现失败所需的全部信息。切勿附上密钥。**[提交 issue](../../issues)**，欢迎 PR。

## 📄 许可证

MIT © 2026——见 [LICENSE](LICENSE)。

<div align="center">

**[MIT](LICENSE)** © 2026 liangjiewis-bulk-apikey 贡献者

</div>