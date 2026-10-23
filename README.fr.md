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

**Créez en masse des comptes liangjiewis.com avec des clés API générées automatiquement — inférence compatible OpenAI (Claude, GPT, Gemini, DeepSeek, GLM, Qwen) + connecteur 9Router.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-97%20served-412991?style=for-the-badge)](https://liangjiewis.com)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Démarrage rapide](#-quick-start) · [🎁 Niveau gratuit](#-free-tier--how-much-you-get) · [🤖 Modèles](#-models--all-97-of-them) · [🧪 Utiliser l'API](#-how-to-use-the-api) · [✅ Vérifié](#-verified-working--every-key-is-tested) · [🧭 Comment ça marche](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ Options](#️-cli-options) · [🛰️ Proxys](#️-behind-a-proxy) · [🐞 Problèmes](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Pourquoi ce projet existe

liangjiewis.com (量界智算) liste **97 modèles** et ne protège l'inscription que par e-mail — **aucun captcha** (`turnstile_check: false`). Un compte fraîchement créé arrive à **`quota 0` (`＄0.000000`)** avec **aucun check-in quotidien** (`签到功能未启用`) et **0 modèle à prix nul** dans sa table tarifaire de 129 lignes, donc chaque clé générée est *authentique* (`GET /v1/models` **200**) et *soumise au crédit* (`POST /v1/chat/completions` **403** `insufficient_user_quota`). Un compte par clé ; N clés = N comptes, chacun avec son propre budget.

## 🎁 Niveau gratuit — ce que vous obtenez

**Un compte liangjiewis.com fraîchement créé ne porte aucun crédit — l'outil génère des clés authentiques dont le compte doit encore être rechargé.**

| Élément | Mesuré |
| --- | --- |
| Crédit à l'inscription | **aucun crédit** — chaque compte arrive à `quota 0` (`＄0.000000`) |
| Check-in quotidien | **désactivé** (`签到功能未启用`) — aucun rechargement |
| Modèles à prix nul | **aucun** — `/api/pricing` (129 lignes, lues avec une session de compte) liste 0 modèle à prix nul |
| Captcha à l'inscription | **aucun** (`turnstile_check: false`) |
| E-mail accepté par le panneau | `@gmail.com` simple (forme sans point) ; `@qq.com` est refusé (`550 … non-existent account`) ; envoi via `1449683658@<mail>` (objet `量界智算邮箱验证邮件`) — épinglez-le avec `--sender "1449683658\|量界智算"` |
| Ce qu'une clé générée peut faire aujourd'hui | `GET /v1/models` **200** (97 modèles) — authentique ; `POST /v1/chat/completions` **403** `insufficient_user_quota` jusqu'au rechargement |
| L'unité qui évolue | **un compte = une clé** → `--count N` signifie en réalité « N comptes, chacun avec son propre solde » |

> 💡 Le niveau gratuit est défini par liangjiewis.com et peut changer. Consultez les chiffres en direct sur [liangjiewis.com](https://liangjiewis.com) — et laissez le propre contrôle de l'outil décider :

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Modèles — les 97 au complet

`GET https://liangjiewis.com/v1/models` renvoie **97 identifiants de modèles** pour une clé générée, par exemple :

```
claude-opus-5 · claude-sonnet-5 · claude-haiku-4-5-20251001 · claude-3-5-haiku-20241022
gpt-5.5 · gpt-5.4-mini · gpt-5.1-codex-max · gpt-5-codex · gemini-3-pro-preview
gemini-2.5-flash · gemini-3.1-flash-lite-preview · o3 · o3-mini · o4-mini
text-embedding-3-small
```

**Ce qu'un compte fraîchement créé répond lorsqu'il tente d'*utiliser* un modèle** — mesuré sur chaque clé, cité pour que vous sachiez exactement ce que vous obtiendrez :

| Appel | Statut | Corps |
| --- | --- | --- |
| `POST /v1/chat/completions` (`claude-3-5-haiku-20241022`, l'identifiant listé le moins cher) | **403** | `{"error":{"message":"用户额度不足, 剩余额度: ＄0.000000 (request id: …)","type":"new_api_error","code":"insufficient_user_quota"}}` |

Rechargez le compte et la même clé sert le trafic sans nouvelle génération.

## 🧪 Comment utiliser l'API

L'URL de base est **`https://liangjiewis.com/v1`** — compatible OpenAI, donc tout ce qui parle OpenAI fonctionne (SDK, Cursor, OpenCode, Kilo Code, …).

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

Tant que le compte n'est pas rechargé, cela répond `403 insufficient_user_quota` — le refus vient du solde du compte, pas d'un défaut de la clé.

## 🛠 Démarrage rapide

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

Les clés sont ajoutées à `keys.txt`, une par ligne, une fois qu'une clé a répondu `GET /v1/models` 200 *et* qu'un appel de modèle est revenu pour elle — sur un compte fraîchement créé ici, cet appel est le refus de crédit, qui est enregistré comme tel et ne retient pas la clé. Les comptes s'exécutent l'un après l'autre ; `--count 10` est une longue exécution, et `out/pinned-<date>.log` en est le journal continu. Rien n'est envoyé au panneau sans passer par une sortie de `proxies.txt`.

### 🖱️ Le lanceur

```bash
node src/launcher.js
```

Un menu au-dessus des modules de tâches : **mint**, **verify**, **9Router**. Il demande `count` (clés par exécution) et `parallel exits`, les conserve dans `launcher.config.json`, et lance `node src/cli.js <task>` avec les bons drapeaux. L'élément de menu **6** exécute directement l'enregistrement 9Router.

## ✅ Vérifié fonctionnel — chaque clé est testée

Mesuré le **2026-10-15** : **chaque compte a généré sa propre clé, une clé par compte**. Chaque clé a été vérifiée après son existence, sur une sortie *indépendante* de la génération, et chaque clé a été revérifiée plus tard le même jour.

| Modèle | En direct (models) | Appel de chat réel | Mesuré |
| --- | --- | --- | --- |
| `claude-3-5-haiku-20241022` | **200** · 97 modèles | **403** `insufficient_user_quota` (`＄0.000000`) · ✔ **en direct** (revérifié 13:11) | 2026-10-15 09:41 |
| `claude-3-5-haiku-20241022` | **200** · 97 modèles | **403** `insufficient_user_quota` (`＄0.000000`) · ✔ **en direct** (revérifié 13:11) | 2026-10-15 09:42 |
| `claude-3-5-haiku-20241022` | **200** · 97 modèles | **403** `insufficient_user_quota` (`＄0.000000`) · ✔ **en direct** (revérifié 13:11) | 2026-10-15 12:33 |

**Les trois étaient en direct comme indiqué** — revérifiés le 2026-10-15 13:11 UTC avec `src/verify.js` lui-même : **chaque clé a répondu `GET /v1/models` 200** (97 modèles chacune, chacune sur une sortie fraîche — aucune n'étant celle de la génération), **3/3 à court de crédit** (`403 insufficient_user_quota`). `GET /v1/models` 200 prouve qu'une clé est *authentique* ; la colonne de complétion montre ce qu'un compte fraîchement créé peut *dépenser*. `node src/cli.js verify` reproduit la vérification pour votre propre fichier.

> **Contrôles qualité.** Chaque clé ici a passé un `chat-200` en direct avant d'être écrite dans `keys.txt`
> (les clés mortes ne sont jamais livrées). Les combinaisons de routeur suivent la même règle au niveau du modèle : une entrée n'est
> ajoutée **que si le modèle répond `chat-200` et peut appeler des outils** — un modèle sans prise en charge des outils,
> une clé morte ou un fournisseur mort est écarté au lieu d'être ajouté. Relancez l'étape de vérification à tout moment ;
> les échecs sont signalés, jamais masqués.

## 🧭 Comment ça marche

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: liangjiewis.com page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://liangjiewis.com/v1/chat/completions → real content = the key is live
```

| Étape | Appel | Notes |
| --- | --- | --- |
| Contrôles | `GET /api/status` | `email_verification: true` · `turnstile_check: false` · `checkin_enabled: false` · Gmail accepté (forme simple) |
| Boîte mail | [Emailnator](https://www.emailnator.com) | une adresse Gmail fraîche par compte, lue via vos sorties |
| Envoi du code | `GET /api/verification?email=<plain>` | `{"success":true}` |
| Inscription | `POST /api/user/register` | `{"success":true}` |
| Connexion | `POST /api/user/login` | cookie de session + `GET /api/user/self` → `quota: 0` |
| Jeton | `POST /api/token/` | une clé par compte |
| Check-in | `POST /api/user/checkin` | `{"success":false,"message":"签到功能未启用"}` — signale correctement la désactivation ; aucun crédit |
| Preuve | `GET /v1/models` + `POST /v1/chat/completions` | les deux enregistrés avec la sortie d'observation ; le refus de chat ici est la *barrière de crédit*, pas un défaut de clé |

## ⚙️ Options CLI

Tout le code se trouve dans `src/` — exécutez-le depuis la racine du dépôt avec `node src/<file>.js`.

| Outil | Drapeaux |
| --- | --- |
| `src/mint.js` | `--count N` (3) · `--pool FILE` (`proxies.txt`) · `--mail emailnator\|imap` · `--imap-user` / `--imap-pass` (ou `IMAP_USER` / `IMAP_PASS`) · `--mail-address` · `--sender REGEX` (par défaut `1449683658\|量界智算`) · `--model ID` · `--poll-ms` (2000) · `--code-wait` (300000) · `--max-cycle` (3) · `--scan` (200) · `--scan-conc` (8, max 8) · `--budget` (2400 s) · `--base URL` |
| `src/verify.js` | `--key K` · `--all` · `--model ID` · `--max-tokens` (8) · `--want` (3) · `--pool FILE` · `--base URL` |
| `src/launcher.js` | interactif : mint / verify / settings — `count` et `concurrency` persistent dans `launcher.config.json` |

## 🛰️ Derrière un proxy

**Facultatif — recommandé à grande échelle (limites par IP, bannissements).** L'outil fonctionne aussi sans proxy.

* **Avec un pool :** passez `--pool <file>` (ou placez des sorties dans `proxies.txt`) et chaque requête passe par une sortie de cette liste — une ligne morte fait échouer cette tentative et l'outil passe à la suivante.
* **Sans pool :** le CLI affiche `running WITHOUT a proxy (direct)` et se connecte directement. Rien ne change concernant l'inscription, la génération de clés ou la vérification — seul le point de départ des paquets change.

* Les sorties proviennent de `proxies.txt` (une ligne par sortie, `scheme://host:port`, `user:pass@` pris en charge, commentaires `#` ignorés). Le même pool alimente les appels au panneau, la vérification des clés et les lectures de la boîte mail lorsqu'il est fourni ; sans pool, les outils se connectent directement.
* **Le filtrage, c'est le travail.** Chaque compte épingle la première sortie qui prouve `GET /api/status` contre l'hôte du panneau, et la vérification épingle une sortie prouvée *différente* — une sortie morte se retire d'elle-même et le compte continue sur la suivante.
* La boîte mail ([Emailnator](https://www.emailnator.com)) est un service de courrier temporaire tiers plutôt que le panneau ; son API est également lue via vos sorties lorsqu'un pool est fourni.
* Le courriel de vérification arrive de **`1449683658`** (`量界智算邮箱验证邮件`) — pas du domaine du panneau — c'est pourquoi le `--sender` par défaut épingle cet expéditeur afin que le code d'un inconnu sur une boîte partagée ne puisse jamais être soumis.

## 📄 Fichiers

| Chemin | Contenu |
| --- | --- |
| `keys.txt` | une clé vérifiée en direct par ligne — ignoré par git |
| `accounts.json` | boîte mail, étapes, check-in, les deux sorties de vérification par compte — ignoré par git |
| `models.json` | une capture fraîche de `/v1/models` par exécution — ignoré par git |
| `proxies.txt` | vos sorties, une par ligne — ignoré par git |
| `out/pinned-<date>.log` | le journal par exécution (sortie, timing, réponse exacte du serveur) — ignoré par git |
| `src/mint.js` · `src/verify.js` | les deux moteurs vers lesquels le CLI dispatche |
| `src/connect-9router.js` | enregistre les clés de `keys.txt` comme connexions 9Router |

## 🔌 Se connecter à 9Router

[9Router](https://9router.com) est un routeur auto-hébergé compatible OpenAI. liangjiewis.com est compatible OpenAI, donc enregistrez-le une fois et utilisez toutes les clés :

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
# or: node src/cli.js mint --count 3 --connect-9router
```

Chaque clé de `keys.txt` devient une connexion du nœud fournisseur `liangjiewis` (`--api-key <key>` enregistre une seule clé à la place, `--model <id>` remplace la valeur par défaut). Choisissez ensuite un modèle dans 9Router :

```
liangjiewis/claude-3-5-haiku-20241022
liangjiewis/claude-opus-5
liangjiewis/gpt-5.5
```

Valeurs par défaut : `--base http://localhost:20128`, `--password 123456`, `--prefix liangjiewis`, `--base-url https://liangjiewis.com/v1`, modèle par défaut `claude-3-5-haiku-20241022`.

## 🔌 Se connecter à OmniRoute

[OmniRoute](https://omniroute.online) est un routeur auto-hébergé compatible OpenAI. liangjiewis.com est compatible OpenAI, donc enregistrez-le une fois et utilisez toutes les clés :

```bash
node src/connect-omniroute.js --base http://localhost:20128 --password 123456
# or: node src/cli.js mint --count 3 --connect-omniroute
```

Chaque clé de `keys.txt` devient une connexion du nœud fournisseur `liangjiewis` (`--api-key <key>` enregistre une seule clé à la place, `--model <id>` remplace la valeur par défaut). Choisissez ensuite un modèle dans OmniRoute :

```
liangjiewis/claude-3-5-haiku-20241022
liangjiewis/claude-opus-5
liangjiewis/gpt-5.5
```

Valeurs par défaut : `--base http://localhost:20128`, `--password 123456`, `--prefix liangjiewis`, `--base-url https://liangjiewis.com/v1`, modèle par défaut `claude-3-5-haiku-20241022`.

## 🔑 Ce qu'une clé vous apporte

| | |
| --- | --- |
| 🏢 Fournisseur | **liangjiewis.com** — [liangjiewis.com](https://liangjiewis.com) |
| 🎁 Ce que le fournisseur offre | 97 modèles listés (Claude Opus 5, GPT-5.5, Gemini 3 Pro, O3) — clés authentiques, inférence soumise au crédit |
| 🔑 Ce qu'une clé vous apporte | une clé API limitée à son propre compte : les 97 identifiants de modèles sur le point de terminaison ci-dessous, aux limites de votre forfait. Le quota vit sur le **compte**, ce qui explique précisément pourquoi cet outil crée un compte par clé |
| 🌐 Forme de l'API | Compatible OpenAI : `POST https://liangjiewis.com/v1/chat/completions` |
| 🔒 Vos données | seuls liangjiewis.com et le backend de boîte mail que vous configurez sont contactés ; les clés restent sur votre machine |

## 🐞 Problèmes

Ouvrez un ticket avec l'étape en échec et la fin du journal d'exécution (`out/pinned-<date>.log`) — il contient la sortie, le timing et la réponse exacte du serveur, soit tout ce qu'il faut pour reproduire un échec. Ne joignez jamais de clé. **[Ouvrir un ticket](../../issues)** et les PR sont les bienvenues.

## 📄 Licence

MIT © 2026 — voir [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 liangjiewis-bulk-apikey contributors

</div>