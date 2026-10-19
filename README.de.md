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

**Massenhaft liangjiewis.com-Konten mit automatisch generierten API-Schlüsseln erstellen — OpenAI-kompatible Inferenz (Claude, GPT, Gemini, DeepSeek, GLM, Qwen) + 9Router-Konnektor.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-97%20served-412991?style=for-the-badge)](https://liangjiewis.com)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Schnellstart](#-quick-start) · [🎁 Kostenlose Stufe](#-free-tier--how-much-you-get) · [🤖 Modelle](#-models--all-97-of-them) · [🧪 Die API verwenden](#-how-to-use-the-api) · [✅ Verifiziert](#-verified-working--every-key-is-tested) · [🧭 So funktioniert es](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Optionen](#️-cli-options) · [🛰️ Proxys](#️-behind-a-proxy) · [🐞 Probleme](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Warum es das gibt

liangjiewis.com (量界智算) listet **97 Modelle** auf und beschränkt die Anmeldung nur per E-Mail — **kein Captcha** (`turnstile_check: false`). Ein frisches Konto landet bei **`quota 0` (`＄0.000000`)** mit **keinem täglichen Check-in** (`签到功能未启用`) und **0 Modellen zum Nulltarif** in seiner 129-zeiligen Preistabelle, sodass jeder generierte Schlüssel *authentisch* (`GET /v1/models` **200**) und *guthabenbeschränkt* (`POST /v1/chat/completions` **403** `insufficient_user_quota`) ist. Ein Konto pro Schlüssel; N Schlüssel = N Konten, jedes mit eigenem Budget.

## 🎁 Kostenlose Stufe — wie viel du bekommst

**Ein frisches liangjiewis.com-Konto bringt kein Guthaben mit — das Tool generiert authentische Schlüssel, deren Konto noch aufgeladen werden muss.**

| Element | Gemessen |
| --- | --- |
| Anmeldegutschrift | **kein Guthaben** — jedes Konto landet bei `quota 0` (`＄0.000000`) |
| Täglicher Check-in | **deaktiviert** (`签到功能未启用`) — keine Nachfüllung |
| Modelle zum Nulltarif | **keine** — `/api/pricing` (129 Zeilen, gelesen mit einer Kontositzung) listet 0 Modelle zum Nulltarif |
| Captcha bei der Anmeldung | **keines** (`turnstile_check: false`) |
| E-Mail, die das Panel akzeptiert | einfache `@gmail.com` (punktfreie Form); `@qq.com` wird abgelehnt (`550 … non-existent account`); Versand über `1449683658@qq.com` (Betreff `量界智算邮箱验证邮件`) — fixiere ihn mit `--sender "1449683658\|量界智算"` |
| Was ein generierter Schlüssel heute kann | `GET /v1/models` **200** (97 Modelle) — authentisch; `POST /v1/chat/completions` **403** `insufficient_user_quota` bis aufgeladen |
| Die Einheit, die skaliert | **ein Konto = ein Schlüssel** → `--count N` bedeutet wirklich „N Konten, jedes mit eigenem Guthaben" |

> 💡 Die kostenlose Stufe wird von liangjiewis.com festgelegt und kann sich ändern. Prüfe die aktuellen Zahlen auf [liangjiewis.com](https://liangjiewis.com) — und lass das Gate des Tools selbst entscheiden:

```bash
node src/cli.js verify                 # every key in keys.txt is re-tested against the live API
```

## 🤖 Modelle — alle 97

`GET https://liangjiewis.com/v1/models` liefert **97 Modell-IDs** für einen generierten Schlüssel, zum Beispiel:

```
claude-opus-5 · claude-sonnet-5 · claude-haiku-4-5-20251001 · claude-3-5-haiku-20241022
gpt-5.5 · gpt-5.4-mini · gpt-5.1-codex-max · gpt-5-codex · gemini-3-pro-preview
gemini-2.5-flash · gemini-3.1-flash-lite-preview · o3 · o3-mini · o4-mini
text-embedding-3-small
```

**Was ein frisches Konto antwortet, wenn es versucht, ein Modell zu *nutzen*** — bei jedem Schlüssel gemessen: `POST /v1/chat/completions` antwortet `403` `{"error":{"message":"用户额度不足, 剩余额度: ＄0.000000 (request id: …)","type":"new_api_error","code":"insufficient_user_quota"}}` bis das Konto aufgeladen ist. Ein erneuter Scan der Repository-Schlüssel vom 2026-10-19 ergab **2 von 5 aufgeladen**: diese Schlüssel antworten `200` auf die untenstehenden IDs, während jede andere Katalog-ID weiterhin die Guthabenverweigerung zurückgibt. Lade das Konto auf, und derselbe Schlüssel bedient Traffic ohne Neugenerierung.

|Modell|✓|
|---|---|
|`claude-3-5-haiku-20241022`|✓|
|`claude-3-5-sonnet-20240620`|✓|
|`claude-haiku-4-5-20251001`|✓|
|`claude-opus-4-1-20250805`|✓|

## 🧪 Die API verwenden

Die Basis-URL ist **`https://liangjiewis.com/v1`** — OpenAI-kompatibel, also funktioniert alles, was OpenAI spricht (SDKs, Cursor, OpenCode, Kilo Code, …).

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

Bis das Konto aufgeladen ist, antwortet dies mit `403 insufficient_user_quota` — die Verweigerung ist das Guthaben des Kontos, kein Defekt des Schlüssels.

## 🛠 Schnellstart

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

Schlüssel werden an `keys.txt` angehängt, einer pro Zeile, sobald ein Schlüssel `GET /v1/models` 200 geantwortet hat *und* ein Modellaufruf dafür zurückgekommen ist — bei einem frischen Konto ist dieser Aufruf hier die Guthabenverweigerung, die genau als solche festgehalten wird und den Schlüssel nicht zurückhält. Konten laufen nacheinander; `--count 10` ist ein langer Lauf, und `out/pinned-<date>.log` ist dessen laufendes Protokoll. Nichts wird an das Panel gesendet, das nicht über einen Exit aus `proxies.txt` läuft.

### 🖱️ Der Launcher

```bash
node src/launcher.js
```

Ein Menü über die Aufgabenmodule: **mint**, **verify**, **9Router**. Es fragt nach `count` (Schlüssel pro Lauf) und `parallel exits`, speichert sie in `launcher.config.json` und startet `node src/cli.js <task>` mit den richtigen Flags. Menüpunkt **6** führt die 9Router-Registrierung direkt aus.

## ✅ Verifiziert funktionierend — jeder Schlüssel wird getestet

Gemessen am **2026-10-15**: **3 Konten → 3 Schlüssel, ein Schlüssel pro Konto**. Jeder Schlüssel wurde geprüft, nachdem er existierte, über einen vom Mint *unabhängigen* Exit, und jeder Schlüssel wurde später am selben Tag erneut geprüft.

| Modell | Live (models) | Echter Chat-Aufruf | Gemessen |
| --- | --- | --- | --- |
| `claude-3-5-haiku-20241022` | **200** · 97 Modelle | **403** `insufficient_user_quota` (`＄0.000000`) · ✔ **live** (erneut geprüft 13:11) | 2026-10-15 12:33 |

**Alle drei waren live wie beschrieben** — erneut geprüft am 2026-10-15 13:11 UTC mit `src/verify.js` selbst: **3/3 Schlüssel antworteten `GET /v1/models` 200** (je 97 Modelle, jeder über einen frischen Exit — keiner vom Mint), **3/3 ohne Guthaben** (`403 insufficient_user_quota`). `GET /v1/models` 200 beweist, dass ein Schlüssel *authentisch* ist; die Completion-Spalte zeigt, was ein frisches Konto *ausgeben* kann. `node src/cli.js verify` reproduziert die Prüfung für deine eigene Datei.

## 🧭 So funktioniert es

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: liangjiewis.com page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://liangjiewis.com/v1/chat/completions → real content = the key is live
```

| Schritt | Aufruf | Hinweise |
| --- | --- | --- |
| Gates | `GET /api/status` | `email_verification: true` · `turnstile_check: false` · `checkin_enabled: false` · Gmail akzeptiert (einfache Form) |
| Postfach | [Emailnator](https://www.emailnator.com) | eine frische Gmail-Adresse pro Konto, gelesen über deine Exits |
| Code senden | `GET /api/verification?email=<plain>` | `{"success":true}` |
| Registrieren | `POST /api/user/register` | `{"success":true}` |
| Anmelden | `POST /api/user/login` | Session-Cookie + `GET /api/user/self` → `quota: 0` |
| Token | `POST /api/token/` | ein Schlüssel pro Konto |
| Check-in | `POST /api/user/checkin` | `{"success":false,"message":"签到功能未启用"}` — meldet korrekt deaktiviert; kein Guthaben |
| Nachweisen | `GET /v1/models` + `POST /v1/chat/completions` | beide mit dem beobachtenden Exit festgehalten; die Chat-Verweigerung hier ist das *Guthaben-Gate*, kein Schlüsseldefekt |

## ⚙️ CLI-Optionen

Der gesamte Code liegt in `src/` — führe ihn vom Repository-Stamm als `node src/<file>.js` aus.

| Tool | Flags |
| --- | --- |
| `src/mint.js` | `--count N` (3) · `--pool FILE` (`proxies.txt`) · `--mail emailnator\|imap` · `--imap-user` / `--imap-pass` (oder `IMAP_USER` / `IMAP_PASS`) · `--mail-address` · `--sender REGEX` (Standard `1449683658\|量界智算`) · `--model ID` · `--poll-ms` (2000) · `--code-wait` (300000) · `--max-cycle` (3) · `--scan` (200) · `--scan-conc` (8, max 8) · `--budget` (2400 s) · `--base URL` |
| `src/verify.js` | `--key K` · `--all` · `--model ID` · `--max-tokens` (8) · `--want` (3) · `--pool FILE` · `--base URL` |
| `src/launcher.js` | interaktiv: mint / verify / settings — `count` und `concurrency` bleiben in `launcher.config.json` erhalten |

## 🛰️ Hinter einem Proxy

* Exits kommen aus `proxies.txt` (eine Zeile pro Exit, `scheme://host:port`, `user:pass@` unterstützt, `#`-Kommentare ignoriert). Derselbe Pool speist die Panel-Aufrufe, die Schlüsselverifizierung und die Postfach-Lesevorgänge; die Tools wählen den Anbieter nie direkt an.
* **Screening ist die Arbeit.** Jedes Konto fixiert den ersten Exit, der `GET /api/status` gegen den Panel-Host beweist, und die Verifizierung fixiert einen *anderen* bewiesenen Exit — ein toter Exit zieht sich selbst zurück und das Konto fährt mit dem nächsten fort.
* Das Postfach ([Emailnator](https://www.emailnator.com)) ist ein Drittanbieter-Temp-Mail-Dienst und nicht das Panel; seine API wird ebenfalls über deine Exits gelesen.
* Die Verifizierungsmail kommt von **`1449683658@qq.com`** (`量界智算邮箱验证邮件`) — nicht von der Panel-Domain — weshalb der Standard-`--sender` diesen Absender fixiert, damit der Code eines Fremden aus einem geteilten Postfach niemals eingereicht werden kann.

## 📄 Dateien

| Pfad | Inhalt |
| --- | --- |
| `keys.txt` | ein live-verifizierter Schlüssel pro Zeile — von Git ignoriert |
| `accounts.json` | Postfach, Schritte, Check-in, beide Verify-Exits pro Konto — von Git ignoriert |
| `models.json` | eine frische `/v1/models`-Aufzeichnung pro Lauf — von Git ignoriert |
| `proxies.txt` | deine Exits, einer pro Zeile — von Git ignoriert |
| `out/pinned-<date>.log` | das Protokoll pro Lauf (Exit, Timing, exakte Serverantwort) — von Git ignoriert |
| `src/mint.js` · `src/verify.js` | die beiden Engines, an die die CLI weiterleitet |
| `src/connect-9router.js` | registriert die Schlüssel in `keys.txt` als 9Router-Verbindungen |

## 🔌 Mit 9Router verbinden

[9Router](https://9router.com) ist ein selbst gehosteter, OpenAI-kompatibler Router. liangjiewis.com ist OpenAI-kompatibel, also registriere es einmal und nutze jeden Schlüssel:

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
# or: node src/cli.js mint --count 3 --connect-9router
```

Jeder Schlüssel in `keys.txt` wird zu einer Verbindung des `liangjiewis`-Provider-Knotens (`--api-key <key>` registriert stattdessen einen einzelnen Schlüssel, `--model <id>` überschreibt den Standard). Wähle dann ein Modell innerhalb von 9Router:

```
liangjiewis/claude-3-5-haiku-20241022
liangjiewis/claude-opus-5
liangjiewis/gpt-5.5
```

Standardwerte: `--base http://localhost:20128`, `--password 123456`, `--prefix liangjiewis`, `--base-url https://liangjiewis.com/v1`, Standardmodell `claude-3-5-haiku-20241022`.

## 🔑 Was ein Schlüssel dir bringt

| | |
| --- | --- |
| 🏢 Anbieter | **liangjiewis.com** — [liangjiewis.com](https://liangjiewis.com) |
| 🎁 Was der Anbieter gibt | 97 gelistete Modelle (Claude Opus 5, GPT-5.5, Gemini 3 Pro, O3) — Schlüssel authentisch, Inferenz guthabenbeschränkt |
| 🔑 Was ein Schlüssel dir bringt | ein API-Schlüssel, der auf sein eigenes Konto beschränkt ist: die 97 Modell-IDs am untenstehenden Endpunkt, zu den Limits deines Tarifs. Das Kontingent liegt beim **Konto**, weshalb dieses Tool genau ein Konto pro Schlüssel erstellt |
| 🌐 API-Form | OpenAI-kompatibel: `POST https://liangjiewis.com/v1/chat/completions` |
| 🔒 Deine Daten | nur liangjiewis.com und das von dir konfigurierte Postfach-Backend werden kontaktiert; Schlüssel bleiben auf deinem Rechner |

## 🐞 Probleme

Eröffne ein Issue mit dem fehlgeschlagenen Schritt und dem Ende des Laufprotokolls (`out/pinned-<date>.log`) — es enthält den Exit, das Timing und die exakte Serverantwort, also alles, was zur Reproduktion eines Fehlschlags nötig ist. Hänge niemals einen Schlüssel an. **[Eröffne ein Issue](../../issues)** und PRs sind willkommen.

## 📄 Lizenz

MIT © 2026 — siehe [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 liangjiewis-bulk-apikey contributors

</div>