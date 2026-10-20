<div align="center">

```
██╗     ██╗ █████╗ ███╗   ██╗ ██████╗      ██╗██╗███████╗██╗    ██╗██╗███████╗
██║     ██║██╔══██╗████╗  ██║██╔════╝      ██║██║██╔════╝██║    ██║██║██╔════╝
██║     ██║███████║██╔██╗ ██║██║  ███╗     ██║██║█████╗  ██║ █╗ ██║██║███████╗
██║     ██║██╔══██║██║╚██╗██║██║   ██║██   ██║██║██╔══╝  ██║███╗██║██║╚════██║
███████╗██║██║  ██║██║ ╚████║╚██████╔╝╚█████╔╝██║███████╗╚███╔███╔╝██║███████║
╚══════╝╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝  ╚════╝ ╚═╝╚══════╝ ╚══╝╚══╝ ╚══╝╚══════╝
```

# liangjiewis-bulk-apikey

**Créez en masse des comptes liangjiewis.com avec des clés API générées automatiquement — inférence compatible OpenAI (Claude, GPT, Gemini, DeepSeek, GLM, Qwen) + connecteur 9Router.**

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

liangjiewis.com (量界智算) répertorie **97 modèles** et ne permet l’inscription que par e‑mail — **pas de captcha** (`turnstile_check: false`). Un compte fraîchement créé démarre avec **`quota 0` (`＄0.000000`)** sans **enregistrement quotidien** (`签到功能未启用`) et **0 modèle gratuit** dans son tableau tarifaire de 129 lignes, de sorte que chaque clé générée est *authentique* (`GET /v1/models` **200**) et *soumise à un crédit* (`POST /v1/chat/completions` **403** `insufficient_user_quota`). Un compte par clé ; N clés = N comptes, chacun avec son propre budget.

## 🎁 Free tier — how much you get

**Un compte fraîchement créé sur liangjiewis.com ne possède aucun crédit — l’outil crée des clés authentiques dont le compte doit encore être rechargé.**

| Élément | Mesuré |
| --- | --- |
| Prime d'inscription | **pas de crédit** — chaque compte démarre avec `quota 0` (`＄0.000000`) |
| Enregistrement quotidien | **désactivé** (`签到功能未启用`) — aucun rechargement |
| Modèles gratuits | **aucun** — `/api/pricing` (129 lignes, lu avec une session de compte) indique 0 modèle gratuit |
| Captcha à l'inscription | **aucun** (`turnstile_check: false`) |
| E‑mail accepté par le panneau | forme simple `@gmail.com` (sans point) ; `@qq.com` est refusé (`550 … non-existent account`) ; envoyez via `1449683658` (sujet `量界智算邮箱验证邮件`) — épinglez‑le avec `--sender "1449683658\\|量界智算"` |
| Ce qu’une clé créée peut faire aujourd’hui | `GET /v1/models` **200** (97 modèles) — authentique ; `POST /v1/chat/completions` **403** `insufficient_user_quota` jusqu’à ce que le compte soit financé |
| L’unité qui s’échelle | **un compte = une clé** → `--count N` signifie réellement « N comptes, chacun avec son propre solde » |

> 💡 Le niveau gratuit est fixé par liangjiewis.com et peut changer. Vérifiez les chiffres en temps réel sur [liangjiewis.com](https://liangjiewis.com) — et laissez la propre porte de l’outil décider :

```bash
node src/cli.js verify                 # chaque clé dans keys.txt est retestée contre l’API en direct
```

## 🤖 Models — all 97 of them

`GET https://liangjiewis.com/v1/models` renvoie **97 identifiants de modèle** pour une clé créée, par exemple :

```
claude-opus-5 · claude-sonnet-5 · claude-haiku-4-5-20251001 · claude-3-5-haiku-20241022
gpt-5.5 · gpt-5.4-mini · gpt-5.1-codex-max · gpt-5-codex · gemini-3-pro-preview
gemini-2.5-flash · gemini-3.1-flash-lite-preview · o3 · o3-mini · o4-mini
text-embedding-3-small
```

**Ce qu’un compte frais répond lorsqu’il essaie d’*utiliser* un modèle** — mesuré sur chaque clé : `POST /v1/chat/completions` renvoie `403` `{"error":{"message":"用户额度不足, 剩余额度: ＄0.000000 (request id: …)","type":"new_api_error","code":"insufficient_user_quota"}}` tant que le compte n’est pas financé. Un re‑scan du 19‑10‑2026 des clés du dépôt a trouvé **2 sur 5 financées** : ces clés renvoient `200` sur les identifiants ci‑dessous, tandis que chaque autre identifiant du catalogue renvoie toujours le refus de crédit. Rechargez le compte et la même clé servira le trafic sans re‑mint.

|Model|✓|
|---|---|
|`claude-3-5-haiku-20241022`|✓|
|`claude-3-5-sonnet-20240620`|✓|
|`claude-haiku-4-5-20251001`|✓|
|`claude-opus-4-1-20250805`|✓|

## 🧪 How to use the API

L’URL de base est **`https://liangjiewis.com/v1`** — compatible OpenAI, donc tout ce qui parle OpenAI fonctionne (SDK, Cursor, OpenCode, Kilo Code, …).

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

Tant que le compte n’est pas financé, cela répond `403 insufficient_user_quota` — le refus provient du solde du compte, pas d’un défaut de la clé.

## 🛠 Quick start

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

Les clés sont ajoutées à `keys.txt`, une par ligne, dès qu’une clé a répondu `GET /v1/models` 200 *et* qu’un appel de modèle est revenu — sur un compte frais, cet appel est le refus de crédit, qui est enregistré tel quel et ne retient pas la clé. Les comptes s’exécutent les uns après les autres ; `--count 10` représente une longue exécution, et `out/pinned-<date>.log` en est le journal en temps réel. Aucun élément n’est envoyé au panneau sans passer par une sortie de `proxies.txt`.

### 🖱️ The launcher

```bash
node src/launcher.js
```

Un menu sur les modules de tâche : **mint**, **verify**, **9Router**. Il demande `count` (clés par exécution) et `parallel exits`, les conserve dans `launcher.config.json`, et lance `node src/cli.js <task>` avec les bons drapeaux. L’option de menu **6** exécute directement l’enregistrement 9Router.

## ✅ Verified working — every key is tested

Mesuré le **15‑10‑2026** : **3 comptes → 3 clés, une clé par compte**. Chaque clé a été vérifiée après sa création, via une sortie *indépendante* du mint, et chaque clé a été revérifiée plus tard le même jour.

| Modèle | En direct (modèles) | Appel réel de chat | Mesuré |
| --- | --- | --- | --- |
| `claude-3-5-haiku-20241022` | **200** · 97 modèles | **403** `insufficient_user_quota` (`＄0.000000`) · ✔ **live** (re‑checked 13:11) | 2026-10-15 12:33 |

**Les trois étaient en direct comme indiqué** — revérifiées le 15‑10‑2026 à 13:11 UTC avec `src/verify.js` : **3/3 clés ont répondu `GET /v1/models` 200** (97 modèles chacune, chacune via une sortie fraîche — aucune n’est celle du mint), **3/3 hors crédit** (`403 insufficient_user_quota`). `GET /v1/models` 200 prouve qu’une clé est *authentique* ; la colonne de complétion montre ce qu’un compte frais peut *dépenser*. `node src/cli.js verify` reproduit la vérification pour votre propre fichier.

## 🧭 How it works

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: liangjiewis.com page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://liangjiewis.com/v1/chat/completions → real content = the key is live
```

| Étape | Appel | Remarques |
| --- | --- | --- |
| Gates | `GET /api/status` | `email_verification: true` · `turnstile_check: false` · `checkin_enabled: false` · Gmail accepté (forme simple) |
| Mailbox | [Emailnator](https://www.emailnator.com) | une adresse Gmail fraîche par compte, lue via vos sorties |
| Send code | `GET /api/verification?email=<plain>` | `{"success":true}` |
| Register | `POST /api/user/register` | `{"success":true}` |
| Login | `POST /api/user/login` | cookie de session + `GET /api/user/self` → `quota: 0` |
| Token | `POST /api/token/` | une clé par compte |
| Check-in | `POST /api/user/checkin` | `{"success":false,"message":"签到功能未启用"}` — indique correctement que la fonction est désactivée ; aucun crédit |
| Prove | `GET /v1/models` + `POST /v1/chat/completions` | les deux enregistrés avec la sortie observée ; le refus de chat ici est la *porte de crédit*, pas un défaut de la clé |

## ⚙️ CLI options

Tout le code se trouve dans `src/` — lancez‑le depuis la racine du dépôt avec `node src/<file>.js`.

| Outil | Drapeaux |
| --- | --- |
| `src/mint.js` | `--count N` (3) · `--pool FILE` (`proxies.txt`) · `--mail emailnator\|imap` · `--imap-user` / `--imap-pass` (or `IMAP_USER` / `IMAP_PASS`) · `--mail-address` · `--sender REGEX` (default `1449683658\|量界智算`) · `--model ID` · `--poll-ms` (2000) · `--code-wait` (300000) · `--max-cycle` (3) · `--scan` (200) · `--scan-conc` (8, max 8) · `--budget` (2400 s) · `--base URL` |
| `src/verify.js` | `--key K` · `--all` · `--model ID` · `--max-tokens` (8) · `--want` (3) · `--pool FILE` · `--base URL` |
| `src/launcher.js` | interactif : mint / verify / settings — `count` et `concurrency` persistent dans `launcher.config.json` |

## 🛰️ Behind a proxy

* Les sorties proviennent de `proxies.txt` (une ligne par sortie, `scheme://host:port`, prise en charge de `user:pass@`, les commentaires `#` sont ignorés). Le même pool alimente les appels du panneau, la vérification des clés et la lecture des boîtes aux lettres ; les outils ne contactent jamais directement le fournisseur.
* **Le filtrage fait le travail.** Chaque compte épingle la première sortie qui prouve `GET /api/status` contre l’hôte du panneau, et la vérification épingle une sortie *différente* prouvée — une sortie morte se retire d’elle‑même et le compte passe à la suivante.
* La boîte aux lettres ([Emailnator](https://www.emailnator.com)) est un service de mail temporaire tiers, pas le panneau ; son API est également lue via vos sorties.
* Le mail de vérification provient de **`1449683658`** (`量界智算邮箱验证邮件`) — pas du domaine du panneau — ce qui explique pourquoi le `--sender` par défaut épingle cet expéditeur afin qu’un code provenant d’une boîte partagée ne puisse jamais être soumis.

## 📄 Files

| Chemin | Contenu |
| --- | --- |
| `keys.txt` | une clé vérifiée en direct par ligne — ignorée par git |
| `accounts.json` | boîte aux lettres, étapes, enregistrement, deux sorties de vérification par compte — ignoré par git |
| `models.json` | capture fraîche de `/v1/models` par exécution — ignorée par git |
| `proxies.txt` | vos sorties, une par ligne — ignorée par git |
| `out/pinned-<date>.log` | le journal de chaque exécution (sortie, timing, réponse exacte du serveur) — ignoré par git |
| `src/mint.js` · `src/verify.js` | les deux moteurs que le CLI déclenche |
| `src/connect-9router.js` | enregistre les clés de `keys.txt` comme connexions 9Router |

## 🔌 Connect to 9Router

[9Router](https://9router.com) est un routeur auto‑hébergé compatible OpenAI. liangjiewis.com est compatible OpenAI, donc enregistrez‑le une fois et utilisez chaque clé :

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
# or: node src/cli.js mint --count 3 --connect-9router
```

Chaque clé de `keys.txt` devient une connexion du nœud fournisseur `liangjiewis` (`--api-key <key>` enregistre une seule clé à la place, `--model <id>` surcharge le défaut). Puis choisissez un modèle dans 9Router :

```
liangjiewis/claude-3-5-haiku-20241022
liangjiewis/claude-opus-5
liangjiewis/gpt-5.5
```

Valeurs par défaut : `--base http://localhost:20128`, `--password 123456`, `--prefix liangjiewis`, `--base-url https://liangjiewis.com/v1`, modèle par défaut `claude-3-5-haiku-20241022`.

## 🔑 What one key gets you

| | |
| --- | --- |
| 🏢 Fournisseur | **liangjiewis.com** — [liangjiewis.com](https://liangjiewis.com) |
| 🎁 Ce que le fournisseur offre | 97 modèles listés (Claude Opus 5, GPT‑5.5, Gemini 3 Pro, O3) — clés authentiques, inférence soumise à un crédit |
| 🔑 Ce que vous offre une clé | une clé API liée à son propre compte : les 97 identifiants de modèle sur le point d’accès ci‑dessous, selon les limites de votre plan. Le quota vit sur le **compte**, ce qui explique pourquoi cet outil crée un compte par clé |
| 🌐 Forme de l’API | compatible OpenAI : `POST https://liangjiewis.com/v1/chat/completions` |
| 🔒 Vos données | seules liangjiewis.com et le backend de la boîte aux lettres que vous configurez sont contactés ; les clés restent sur votre machine |

## 🐞 Issues

Ouvrez un ticket en indiquant l’étape qui a échoué et la fin du journal d’exécution (`out/pinned-<date>.log`) — il contient la sortie, le timing et la réponse exacte du serveur, soit tout ce qu’il faut pour reproduire le problème. N’attachez jamais de clé. **[Ouvrir un ticket](../../issues)** et les PR sont les bienvenus.

## 📄 License

MIT © 2026 — voir [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 liangjiewis-bulk-apikey contributeurs

</div>