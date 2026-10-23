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

**liangjiewis.com のアカウントを自動生成された API キーとともに一括作成 — OpenAI 互換の推論（Claude、GPT、Gemini、DeepSeek、GLM、Qwen）+ 9Router コネクタ。**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-97%20served-412991?style=for-the-badge)](https://liangjiewis.com)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 クイックスタート](#-quick-start) · [🎁 無料枠](#-free-tier--how-much-you-get) · [🤖 モデル](#-models--all-97-of-them) · [🧪 API の使い方](#-how-to-use-the-api) · [✅ 検証済み](#-verified-working--every-key-is-tested) · [🧭 仕組み](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ オプション](#️-cli-options) · [🛰️ プロキシ](#️-behind-a-proxy) · [🐞 イシュー](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ これが存在する理由

liangjiewis.com（量界智算）は **97 モデル**を掲載しており、サインアップはメールアドレスのみで制限されています — **キャプチャなし**（`turnstile_check: false`）。新規アカウントは **`quota 0`（`＄0.000000`）** で、**デイリーチェックインなし**（`签到功能未启用`）、129 行の価格表に **ゼロ価格モデルは 0 件**です。そのため、発行されるすべてのキーは*本物*（`GET /v1/models` **200**）であり、*クレジットで制限*されています（`POST /v1/chat/completions` **403** `insufficient_user_quota`）。1 アカウントにつき 1 キー、N キー = N アカウントで、それぞれが独自の予算を持ちます。

## 🎁 無料枠 — どれだけ得られるか

**新規の liangjiewis.com アカウントにはクレジットがありません — このツールは、アカウントにまだチャージが必要な本物のキーを発行します。**

| 項目 | 実測値 |
| --- | --- |
| サインアップ特典 | **クレジットなし** — すべてのアカウントは `quota 0`（`＄0.000000`）で始まる |
| デイリーチェックイン | **無効**（`签到功能未启用`）— 補充なし |
| ゼロ価格モデル | **なし** — `/api/pricing`（129 行、アカウントセッションで読み取り）にゼロ価格モデルは 0 件 |
| サインアップ時のキャプチャ | **なし**（`turnstile_check: false`） |
| パネルが受け付けるメール | プレーンな `@gmail.com`（ドットなし形式）。`@qq.com` は拒否される（`550 … non-existent account`）。`1449683658@<mail>` 経由で送信（件名 `量界智算邮箱验证邮件`）— `--sender "1449683658\|量界智算"` で固定する |
| 発行されたキーが現在できること | `GET /v1/models` **200**（97 モデル）— 本物。`POST /v1/chat/completions` は入金まで **403** `insufficient_user_quota` |
| スケールする単位 | **1 アカウント = 1 キー** → `--count N` は実質「N アカウント、それぞれが独自の残高を持つ」 |

> 💡 無料枠は liangjiewis.com が設定しており、変更される可能性があります。最新の数値は [liangjiewis.com](https://liangjiewis.com) で確認してください — そしてツール自身のゲートに判断させてください：

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 モデル — 全 97 件

`GET https://liangjiewis.com/v1/models` は、発行されたキーに対して **97 個のモデル ID** を返します。例えば：

```
claude-opus-5 · claude-sonnet-5 · claude-haiku-4-5-20251001 · claude-3-5-haiku-20241022
gpt-5.5 · gpt-5.4-mini · gpt-5.1-codex-max · gpt-5-codex · gemini-3-pro-preview
gemini-2.5-flash · gemini-3.1-flash-lite-preview · o3 · o3-mini · o4-mini
text-embedding-3-small
```

**新規アカウントがモデルを*使おう*としたときの応答** — すべてのキーで実測し、何が得られるかを正確に知ってもらうために引用します：

| 呼び出し | ステータス | ボディ |
| --- | --- | --- |
| `POST /v1/chat/completions`（`claude-3-5-haiku-20241022`、掲載されている中で最も安い ID） | **403** | `{"error":{"message":"用户额度不足, 剩余额度: ＄0.000000 (request id: …)","type":"new_api_error","code":"insufficient_user_quota"}}` |

アカウントにチャージすれば、同じキーが再発行なしでトラフィックを処理します。

## 🧪 API の使い方

ベース URL は **`https://liangjiewis.com/v1`** です — OpenAI 互換なので、OpenAI を話せるものなら何でも動作します（SDK、Cursor、OpenCode、Kilo Code など）。

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

アカウントに入金されるまで、これは `403 insufficient_user_quota` を返します — この拒否はアカウントの残高によるものであり、キーの欠陥ではありません。

## 🛠 クイックスタート

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

キーは、`GET /v1/models` が 200 を返し、*かつ*モデル呼び出しが返ってきた時点で `keys.txt` に 1 行ずつ追記されます — ここでの新規アカウントでは、その呼び出しはクレジット拒否であり、まさにそのとおりに記録され、キーは保留されません。アカウントは次々に実行されます。`--count 10` は長時間の実行であり、`out/pinned-<date>.log` がその実行記録です。`proxies.txt` の出口を経由しないものは、パネルに送信されません。

### 🖱️ ランチャー

```bash
node src/launcher.js
```

タスクモジュール上のメニュー：**mint**、**verify**、**9Router**。`count`（実行あたりのキー数）と `parallel exits` を尋ね、それらを `launcher.config.json` に保持し、適切なフラグで `node src/cli.js <task>` を起動します。メニュー項目 **6** は 9Router 登録を直接実行します。

## ✅ 動作検証済み — すべてのキーがテストされています

実測 **2026-10-15**：**各アカウントが独自のキーを発行し、1 アカウントにつき 1 キー**。すべてのキーは、それが存在した後に、mint とは*独立した*出口でチェックされ、すべてのキーは同日の後半に再チェックされました。

| モデル | ライブ（models） | 実際のチャット呼び出し | 実測 |
| --- | --- | --- | --- |
| `claude-3-5-haiku-20241022` | **200** · 97 models | **403** `insufficient_user_quota`（`＄0.000000`）· ✔ **ライブ**（13:11 に再チェック） | 2026-10-15 09:41 |
| `claude-3-5-haiku-20241022` | **200** · 97 models | **403** `insufficient_user_quota`（`＄0.000000`）· ✔ **ライブ**（13:11 に再チェック） | 2026-10-15 09:42 |
| `claude-3-5-haiku-20241022` | **200** · 97 models | **403** `insufficient_user_quota`（`＄0.000000`）· ✔ **ライブ**（13:11 に再チェック） | 2026-10-15 12:33 |

**3 件すべてが記載どおりライブでした** — 2026-10-15 13:11 UTC に `src/verify.js` 自体で再チェック：**すべてのキーが `GET /v1/models` 200 を返しました**（それぞれ 97 モデル、それぞれが新しい出口 — mint のものではない）、**3/3 がクレジット切れ**（`403 insufficient_user_quota`）。`GET /v1/models` 200 はキーが*本物*であることを証明し、completion 列は新規アカウントが*使える*ものを示します。`node src/cli.js verify` は、あなた自身のファイルに対してこのチェックを再現します。

> **品質ゲート。** ここにあるすべてのキーは、`keys.txt` に書き込まれる前にライブの `chat-200` を通過しています
> （死んだキーは決して出荷されません）。ルーターのコンボもモデルレベルで同じルールに従います：エントリは
> **モデルが `chat-200` を返し、ツールを呼び出せる場合にのみ**追加されます — ツールサポートのないモデル、
> 死んだキー、死んだプロバイダーは追加されずに除外されます。検証ステップはいつでも再実行できます。
> 失敗は報告され、決して隠されません。

## 🧭 仕組み

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: liangjiewis.com page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://liangjiewis.com/v1/chat/completions → real content = the key is live
```

| ステップ | 呼び出し | 備考 |
| --- | --- | --- |
| ゲート | `GET /api/status` | `email_verification: true` · `turnstile_check: false` · `checkin_enabled: false` · Gmail 受け入れ（プレーン形式） |
| メールボックス | [Emailnator](https://www.emailnator.com) | アカウントごとに新しい Gmail アドレス、あなたの出口経由で読み取り |
| コード送信 | `GET /api/verification?email=<plain>` | `{"success":true}` |
| 登録 | `POST /api/user/register` | `{"success":true}` |
| ログイン | `POST /api/user/login` | セッション Cookie + `GET /api/user/self` → `quota: 0` |
| トークン | `POST /api/token/` | 1 アカウントにつき 1 キー |
| チェックイン | `POST /api/user/checkin` | `{"success":false,"message":"签到功能未启用"}` — 無効であることを正しく報告。クレジットなし |
| 証明 | `GET /v1/models` + `POST /v1/chat/completions` | どちらも観測した出口とともに記録される。ここでのチャット拒否は*クレジットゲート*であり、キーの欠陥ではない |

## ⚙️ CLI オプション

すべてのコードは `src/` にあります — リポジトリのルートから `node src/<file>.js` として実行してください。

| ツール | フラグ |
| --- | --- |
| `src/mint.js` | `--count N` (3) · `--pool FILE` (`proxies.txt`) · `--mail emailnator\|imap` · `--imap-user` / `--imap-pass` (または `IMAP_USER` / `IMAP_PASS`) · `--mail-address` · `--sender REGEX` (デフォルト `1449683658\|量界智算`) · `--model ID` · `--poll-ms` (2000) · `--code-wait` (300000) · `--max-cycle` (3) · `--scan` (200) · `--scan-conc` (8, 最大 8) · `--budget` (2400 s) · `--base URL` |
| `src/verify.js` | `--key K` · `--all` · `--model ID` · `--max-tokens` (8) · `--want` (3) · `--pool FILE` · `--base URL` |
| `src/launcher.js` | インタラクティブ：mint / verify / settings — `count` と `concurrency` は `launcher.config.json` に保持される |

## 🛰️ プロキシの背後で

**任意 — 大規模では推奨（IP ごとの制限、BAN）。** このツールはプロキシなしでも動作します。

* **プールあり：** `--pool <file>` を渡す（または出口を `proxies.txt` に入れる）と、すべてのリクエストがそのリストの出口を経由します — 死んだ回線はその試行を失敗させ、ツールは次のものに移ります。
* **プールなし：** CLI は `running WITHOUT a proxy (direct)` と表示し、直接接続します。サインアップ、キー発行、検証について何も変わりません — パケットが出ていく場所だけが変わります。

* 出口は `proxies.txt` から取得されます（1 行につき 1 出口、`scheme://host:port`、`user:pass@` 対応、`#` コメントは無視）。同じプールが、提供された場合にはパネル呼び出し、キー検証、メールボックス読み取りに供給されます。プールなしでは、ツールは直接接続します。
* **スクリーニングが作業の中心です。** 各アカウントは、パネルホストに対して `GET /api/status` を証明した最初の出口を固定し、検証は*別の*証明済み出口を固定します — 死んだ出口は自ら引退し、アカウントは次のもので続行します。
* メールボックス（[Emailnator](https://www.emailnator.com)）はパネルではなくサードパーティの一時メールサービスです。プールが提供された場合、その API もあなたの出口経由で読み取られます。
* 検証メールは**`1449683658`**（`量界智算邮箱验证邮件`）から届きます — パネルドメインではありません — そのため、デフォルトの `--sender` はその送信者を固定し、共有ボックスの他人のコードが決して送信されないようにします。

## 📄 ファイル

| パス | 内容 |
| --- | --- |
| `keys.txt` | 1 行につき 1 つのライブ検証済みキー — git 無視 |
| `accounts.json` | メールボックス、ステップ、チェックイン、アカウントごとの両方の検証出口 — git 無視 |
| `models.json` | 実行ごとの新しい `/v1/models` キャプチャ — git 無視 |
| `proxies.txt` | あなたの出口、1 行につき 1 つ — git 無視 |
| `out/pinned-<date>.log` | 実行ごとのログ（出口、タイミング、正確なサーバー応答）— git 無視 |
| `src/mint.js` · `src/verify.js` | CLI がディスパッチする 2 つのエンジン |
| `src/connect-9router.js` | `keys.txt` のキーを 9Router 接続として登録する |

## 🔌 9Router に接続する

[9Router](https://9router.com) はセルフホストの OpenAI 互換ルーターです。liangjiewis.com は OpenAI 互換なので、一度登録すればすべてのキーを使えます：

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
# or: node src/cli.js mint --count 3 --connect-9router
```

`keys.txt` のすべてのキーが `liangjiewis` プロバイダーノードの 1 つの接続になります（`--api-key <key>` は代わりに単一のキーを登録し、`--model <id>` はデフォルトを上書きします）。その後、9Router 内でモデルを選択します：

```
liangjiewis/claude-3-5-haiku-20241022
liangjiewis/claude-opus-5
liangjiewis/gpt-5.5
```

デフォルト：`--base http://localhost:20128`、`--password 123456`、`--prefix liangjiewis`、`--base-url https://liangjiewis.com/v1`、デフォルトモデル `claude-3-5-haiku-20241022`。

## 🔌 OmniRoute に接続する

[OmniRoute](https://omniroute.online) はセルフホストの OpenAI 互換ルーターです。liangjiewis.com は OpenAI 互換なので、一度登録すればすべてのキーを使えます：

```bash
node src/connect-omniroute.js --base http://localhost:20128 --password 123456
# or: node src/cli.js mint --count 3 --connect-omniroute
```

`keys.txt` のすべてのキーが `liangjiewis` プロバイダーノードの 1 つの接続になります（`--api-key <key>` は代わりに単一のキーを登録し、`--model <id>` はデフォルトを上書きします）。その後、OmniRoute 内でモデルを選択します：

```
liangjiewis/claude-3-5-haiku-20241022
liangjiewis/claude-opus-5
liangjiewis/gpt-5.5
```

デフォルト：`--base http://localhost:20128`、`--password 123456`、`--prefix liangjiewis`、`--base-url https://liangjiewis.com/v1`、デフォルトモデル `claude-3-5-haiku-20241022`。

## 🔑 1 つのキーで得られるもの

| | |
| --- | --- |
| 🏢 プロバイダー | **liangjiewis.com** — [liangjiewis.com](https://liangjiewis.com) |
| 🎁 プロバイダーが提供するもの | 97 モデルを掲載（Claude Opus 5、GPT-5.5、Gemini 3 Pro、O3）— キーは本物、推論はクレジットで制限 |
| 🔑 1 つのキーで得られるもの | 独自のアカウントにスコープされた 1 つの API キー：下記エンドポイントの 97 モデル ID を、あなたのプランの制限で。クォータは**アカウント**に存在し、まさにそれがこのツールが 1 キーにつき 1 アカウントを作成する理由です |
| 🌐 API の形 | OpenAI 互換：`POST https://liangjiewis.com/v1/chat/completions` |
| 🔒 あなたのデータ | 接触するのは liangjiewis.com と、あなたが設定した受信箱バックエンドのみ。キーはあなたのマシンに留まります |

## 🐞 イシュー

失敗したステップと実行ログの末尾（`out/pinned-<date>.log`）を添えてイシューを開いてください — そこには出口、タイミング、正確なサーバー応答が含まれており、ミスを再現するために必要なすべてが揃っています。キーは決して添付しないでください。**[イシューを開く](../../issues)** — PR も歓迎します。

## 📄 ライセンス

MIT © 2026 — [LICENSE](LICENSE) を参照。

<div align="center">

**[MIT](LICENSE)** © 2026 liangjiewis-bulk-apikey contributors

</div>