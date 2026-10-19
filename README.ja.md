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

**liangjiewis.com のアカウントを API キー自動生成付きで一括作成 — OpenAI 互換推論(Claude、GPT、Gemini、DeepSeek、GLM、Qwen)+ 9Router コネクター。**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-97%20served-412991?style=for-the-badge)](https://liangjiewis.com)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 クイックスタート](#-quick-start) · [🎁 無料枠](#-free-tier--how-much-you-get) · [🤖 モデル](#-models--all-97-of-them) · [🧪 API の使い方](#-how-to-use-the-api) · [✅ 動作確認済み](#-verified-working--every-key-is-tested) · [🧭 仕組み](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ オプション](#️-cli-options) · [🛰️ プロキシ](#️-behind-a-proxy) · [🐞 問題報告](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>




---

## ✨ なぜこれが存在するのか

liangjiewis.com(量界智算)は **97 モデル**を掲載しており、登録時の関門はメールアドレスだけです — **キャプチャなし**(`turnstile_check: false`)。新規アカウントは **`quota 0`(`＄0.000000`)** に着地し、**デイリーチェックインはなく**(`签到功能未启用`)、129 行の料金表に**ゼロ価格モデルは 0 件**です。したがって発行されるキーはすべて*本物*であり(`GET /v1/models` は **200**)、かつ*クレジットで制限*されます(`POST /v1/chat/completions` は **403** `insufficient_user_quota`)。1 アカウントにつき 1 キー。N キー = N アカウントで、それぞれが独自の予算を持ちます。

## 🎁 無料枠 — どれだけ得られるか

**liangjiewis.com の新規アカウントにはクレジットがありません — このツールが発行するのは本物のキーですが、そのアカウントには依然としてチャージが必要です。**

| 項目 | 実測値 |
| --- | --- |
| 登録時の付与 | **クレジットなし** — どのアカウントも `quota 0`(`＄0.000000`)になる |
| デイリーチェックイン | **無効**(`签到功能未启用`)— 補充なし |
| ゼロ価格モデル | **なし** — `/api/pricing`(129 行、アカウントセッションで読み取り)にゼロ価格モデルは 0 件 |
| 登録時のキャプチャ | **なし**(`turnstile_check: false`) |
| パネルが受け付けるメール | 素の `@gmail.com`(ドットなし形式)。`@qq.com` は拒否される(`550 … non-existent account`)。`1449683658@qq.com` 経由で送信(件名 `量界智算邮箱验证邮件`)— `--sender "1449683658\|量界智算"` で固定する |
| 発行されたキーが現時点でできること | `GET /v1/models` は **200**(97 モデル)— 本物。`POST /v1/chat/completions` は入金するまで **403** `insufficient_user_quota` |
| スケールする単位 | **1 アカウント = 1 キー** → `--count N` は実質「N アカウント、それぞれに独自の残高」 |

> 💡 無料枠は liangjiewis.com 側が設定しており、変更される可能性があります。最新の数値は [liangjiewis.com](https://liangjiewis.com) で確認してください。そしてツール自身のゲートに判断させてください:

```bash
node src/cli.js verify                 # every key in keys.txt is re-tested against the live API
```

## 🤖 モデル — 全 97 種類

`GET https://liangjiewis.com/v1/models` は、発行されたキーに対して **97 個のモデル ID** を返します。例:

```
claude-opus-5 · claude-sonnet-5 · claude-haiku-4-5-20251001 · claude-3-5-haiku-20241022
gpt-5.5 · gpt-5.4-mini · gpt-5.1-codex-max · gpt-5-codex · gemini-3-pro-preview
gemini-2.5-flash · gemini-3.1-flash-lite-preview · o3 · o3-mini · o4-mini
text-embedding-3-small
```

**新規アカウントがモデルを*使おう*としたときに返す答え** — すべてのキーで実測: `POST /v1/chat/completions` はアカウントに入金されるまで `403` `{"error":{"message":"用户额度不足, 剩余额度: ＄0.000000 (request id: …)","type":"new_api_error","code":"insufficient_user_quota"}}` を返します。2026-10-19 にリポジトリ内のキーを再スキャンしたところ、**5 件中 2 件が入金済み**でした。それらのキーは下記の ID に対して `200` を返しますが、その他のカタログ ID はすべてクレジット拒否を返します。アカウントにチャージすれば、同じキーが再発行なしでトラフィックを処理します。

|モデル|✓|
|---|---|
|`claude-3-5-haiku-20241022`|✓|
|`claude-3-5-sonnet-20240620`|✓|
|`claude-haiku-4-5-20251001`|✓|
|`claude-opus-4-1-20250805`|✓|

## 🧪 API の使い方

ベース URL は **`https://liangjiewis.com/v1`** です — OpenAI 互換なので、OpenAI に対応するものなら何でも動作します(SDK、Cursor、OpenCode、Kilo Code など)。

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

キーは `keys.txt` に 1 行に 1 つずつ追記されます。追記されるのは、そのキーが `GET /v1/models` で 200 を返し、*かつ*そのキーに対するモデル呼び出しが戻ってきた後です — ここでの新規アカウントではその呼び出しはクレジット拒否であり、それはまさにその通りに記録され、キーの保存を妨げません。アカウントは 1 つずつ順番に実行されます。`--count 10` は長時間の実行であり、`out/pinned-<date>.log` がその実行記録です。`proxies.txt` の出口を経由しないものはパネルに送信されません。

### 🖱️ ランチャー

```bash
node src/launcher.js
```

タスクモジュール上にメニューを表示します: **mint**、**verify**、**9Router**。`count`(1 回の実行あたりのキー数)と `parallel exits` を尋ね、それらを `launcher.config.json` に保存し、適切なフラグを付けて `node src/cli.js <task>` を起動します。メニュー項目 **6** は 9Router の登録を直接実行します。

## ✅ 動作確認済み — すべてのキーがテストされています

**2026-10-15** に実測: **3 アカウント → 3 キー、1 アカウントにつき 1 キー**。各キーは存在した後に、mint とは*独立*した出口で確認され、さらに同日中に全キーが再確認されました。

| モデル | ライブ(モデル) | 実際のチャット呼び出し | 実測 |
| --- | --- | --- | --- |
| `claude-3-5-haiku-20241022` | **200** · 97 モデル | **403** `insufficient_user_quota`(`＄0.000000`)· ✔ **ライブ**(13:11 に再確認) | 2026-10-15 12:33 |

**3 つすべてが記載どおりライブでした** — 2026-10-15 13:11 UTC に `src/verify.js` 自体で再確認: **3/3 のキーが `GET /v1/models` で 200 を返し**(各 97 モデル、それぞれ新しい出口 — mint の出口ではない)、**3/3 がクレジット切れ**(`403 insufficient_user_quota`)。`GET /v1/models` の 200 はキーが*本物*であることを証明し、completion の列は新規アカウントが*使える*ものを示します。`node src/cli.js verify` で、あなた自身のファイルに対して同じチェックを再現できます。

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
| ゲート | `GET /api/status` | `email_verification: true` · `turnstile_check: false` · `checkin_enabled: false` · Gmail 受け入れ(素の形式) |
| メールボックス | [Emailnator](https://www.emailnator.com) | アカウントごとに新しい Gmail アドレスを、あなたの出口経由で読み取る |
| コード送信 | `GET /api/verification?email=<plain>` | `{"success":true}` |
| 登録 | `POST /api/user/register` | `{"success":true}` |
| ログイン | `POST /api/user/login` | セッション Cookie + `GET /api/user/self` → `quota: 0` |
| トークン | `POST /api/token/` | アカウントごとに 1 キー |
| チェックイン | `POST /api/user/checkin` | `{"success":false,"message":"签到功能未启用"}` — 無効であることを正しく報告。クレジットなし |
| 証明 | `GET /v1/models` + `POST /v1/chat/completions` | どちらも観測した出口とともに記録される。ここでのチャット拒否は*クレジットの関門*であり、キーの欠陥ではない |

## ⚙️ CLI オプション

コードはすべて `src/` にあります — リポジトリのルートから `node src/<file>.js` として実行してください。

| ツール | フラグ |
| --- | --- |
| `src/mint.js` | `--count N` (3) · `--pool FILE` (`proxies.txt`) · `--mail emailnator\|imap` · `--imap-user` / `--imap-pass` (or `IMAP_USER` / `IMAP_PASS`) · `--mail-address` · `--sender REGEX` (default `1449683658\|量界智算`) · `--model ID` · `--poll-ms` (2000) · `--code-wait` (300000) · `--max-cycle` (3) · `--scan` (200) · `--scan-conc` (8, max 8) · `--budget` (2400 s) · `--base URL` |
| `src/verify.js` | `--key K` · `--all` · `--model ID` · `--max-tokens` (8) · `--want` (3) · `--pool FILE` · `--base URL` |
| `src/launcher.js` | インタラクティブ: mint / verify / settings — `count` と `concurrency` は `launcher.config.json` に保存される |

## 🛰️ プロキシの背後で

* 出口は `proxies.txt` から取得します(1 行につき 1 出口、`scheme://host:port`、`user:pass@` 対応、`#` コメントは無視)。同じプールがパネル呼び出し、キー検証、メールボックス読み取りに使われ、ツールがプロバイダーに直接接続することはありません。
* **選別こそが作業です。** 各アカウントは、パネルホストに対して `GET /api/status` を証明できた最初の出口を固定し、検証では*別の*証明済み出口を固定します — 死んだ出口は自ら引退し、アカウントは次の出口で続行します。
* メールボックス([Emailnator](https://www.emailnator.com))はパネルではなくサードパーティの一時メールサービスです。その API もあなたの出口経由で読み取られます。
* 検証メールは(**パネルのドメインではなく**)**`1449683658@qq.com`**(`量界智算邮箱验证邮件`)から届きます。だからこそ既定の `--sender` はその送信者を固定しており、共有受信箱の他人のコードが送信されることは決してありません。

## 📄 ファイル

| パス | 内容 |
| --- | --- |
| `keys.txt` | ライブ検証済みのキーを 1 行に 1 つ — git 管理外 |
| `accounts.json` | メールボックス、ステップ、チェックイン、アカウントごとの 2 つの検証出口 — git 管理外 |
| `models.json` | 実行ごとの新しい `/v1/models` のキャプチャ — git 管理外 |
| `proxies.txt` | あなたの出口、1 行に 1 つ — git 管理外 |
| `out/pinned-<date>.log` | 実行ごとのログ(出口、タイミング、サーバーの正確な応答)— git 管理外 |
| `src/mint.js` · `src/verify.js` | CLI が振り分ける 2 つのエンジン |
| `src/connect-9router.js` | `keys.txt` 内のキーを 9Router の接続として登録する |

## 🔌 9Router への接続

[9Router](https://9router.com) はセルフホスト型の OpenAI 互換ルーターです。liangjiewis.com は OpenAI 互換なので、一度登録すればすべてのキーを使えます:

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
# or: node src/cli.js mint --count 3 --connect-9router
```

`keys.txt` 内のすべてのキーが `liangjiewis` プロバイダーノードの 1 接続になります(`--api-key <key>` は単一キーのみを登録し、`--model <id>` は既定値を上書きします)。その後、9Router 内でモデルを選択してください:

```
liangjiewis/claude-3-5-haiku-20241022
liangjiewis/claude-opus-5
liangjiewis/gpt-5.5
```

既定値: `--base http://localhost:20128`、`--password 123456`、`--prefix liangjiewis`、`--base-url https://liangjiewis.com/v1`、既定モデル `claude-3-5-haiku-20241022`。

## 🔑 1 つのキーで得られるもの

| | |
| --- | --- |
| 🏢 プロバイダー | **liangjiewis.com** — [liangjiewis.com](https://liangjiewis.com) |
| 🎁 プロバイダーが提供するもの | 97 モデルを掲載(Claude Opus 5、GPT-5.5、Gemini 3 Pro、O3)— キーは本物、推論はクレジットで制限 |
| 🔑 1 つのキーで得られるもの | 自身のアカウントに紐づく 1 つの API キー: 下記エンドポイントの 97 モデル ID を、あなたのプランの制限内で利用可能。クォータは**アカウント**に存在するため、このツールがキーごとに 1 アカウントを作成するのです |
| 🌐 API の形式 | OpenAI 互換: `POST https://liangjiewis.com/v1/chat/completions` |
| 🔒 あなたのデータ | 接続先は liangjiewis.com と、あなたが設定した受信箱バックエンドのみ。キーはあなたのマシン上に留まります |

## 🐞 問題報告

失敗したステップと実行ログの末尾(`out/pinned-<date>.log`)を添えて issue を開いてください — そこには出口、タイミング、サーバーの正確な応答が記録されており、失敗を再現するのに必要な情報がすべて揃っています。キーは決して添付しないでください。**[issue を開く](../../issues)** — PR も歓迎します。

## 📄 ライセンス

MIT © 2026 — [LICENSE](LICENSE) を参照してください。

<div align="center">

**[MIT](LICENSE)** © 2026 liangjiewis-bulk-apikey コントリビューター

</div>