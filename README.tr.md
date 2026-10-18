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

**liangjiewis.com hesaplarını otomatik oluşturulan API anahtarlarıyla toplu oluşturun — OpenAI uyumlu çıkarım (Claude, GPT, Gemini, DeepSeek, GLM, Qwen) + 9Router bağlayıcısı.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-97%20served-412991?style=for-the-badge)](https://liangjiewis.com)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Hızlı başlangıç](#-quick-start) · [🎁 Ücretsiz katman](#-free-tier--how-much-you-get) · [🤖 Modeller](#-models--all-97-of-them) · [🧪 API'yi kullanma](#-how-to-use-the-api) · [✅ Doğrulandı](#-verified-working--every-key-is-tested) · [🧭 Nasıl çalışır](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Seçenekler](#️-cli-options) · [🛰️ Proxy'ler](#️-behind-a-proxy) · [🐞 Sorunlar](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>


---

## ✨ Bu neden var

liangjiewis.com (量界智算) **97 model** listeliyor ve kayıt işlemini yalnızca e-posta ile sınırlıyor — **captcha yok** (`turnstile_check: false`). Yeni bir hesap **`quota 0` (`＄0.000000`)** ile başlıyor, **günlük giriş yok** (`签到功能未启用`) ve 129 satırlık fiyatlandırma tablosunda **0 sıfır fiyatlı model** var; bu nedenle üretilen her anahtar *gerçek* (`GET /v1/models` **200**) ve *kredi kapılı* (`POST /v1/chat/completions` **403** `insufficient_user_quota`). Anahtar başına bir hesap; N anahtar = N hesap, her biri kendi bütçesine sahip.

## 🎁 Ücretsiz katman — ne kadar alıyorsunuz

**Yeni bir liangjiewis.com hesabı kredi taşımaz — araç, hesabı hâlâ bakiye yüklemesi gereken gerçek anahtarlar üretir.**

| Öğe | Ölçülen |
| --- | --- |
| Kayıt hibesi | **kredi yok** — her hesap `quota 0` (`＄0.000000`) ile başlıyor |
| Günlük giriş | **devre dışı** (`签到功能未启用`) — yenileme yok |
| Sıfır fiyatlı modeller | **yok** — `/api/pricing` (129 satır, bir hesap oturumuyla okunur) 0 sıfır fiyatlı model listeliyor |
| Kayıtta captcha | **yok** (`turnstile_check: false`) |
| Panelin kabul ettiği e-posta | düz `@gmail.com` (noktasız biçim); `@qq.com` reddediliyor (`550 … non-existent account`); `1449683658@qq.com` üzerinden gönderin (konu `量界智算邮箱验证邮件`) — `--sender "1449683658\|量界智算"` ile sabitleyin |
| Üretilen bir anahtarın bugün yapabildiği | `GET /v1/models` **200** (97 model) — gerçek; `POST /v1/chat/completions` **403** `insufficient_user_quota`, bakiye yüklenene kadar |
| Ölçeklenen birim | **bir hesap = bir anahtar** → `--count N` aslında "N hesap, her biri kendi bakiyesiyle" demektir |

> 💡 Ücretsiz katman liangjiewis.com tarafından belirlenir ve değişebilir. Güncel sayıları [liangjiewis.com](https://liangjiewis.com) adresinden kontrol edin — ve aracın kendi kapısının karar vermesine izin verin:

```bash
node src/cli.js verify                 # every key in keys.txt is re-tested against the live API
```

## 🤖 Modeller — 97'sinin tamamı

`GET https://liangjiewis.com/v1/models`, üretilen bir anahtar için **97 model kimliği** döndürür, örneğin:

```
claude-opus-5 · claude-sonnet-5 · claude-haiku-4-5-20251001 · claude-3-5-haiku-20241022
gpt-5.5 · gpt-5.4-mini · gpt-5.1-codex-max · gpt-5-codex · gemini-3-pro-preview
gemini-2.5-flash · gemini-3.1-flash-lite-preview · o3 · o3-mini · o4-mini
text-embedding-3-small
```

**Yeni bir hesap bir modeli *kullanmaya* çalıştığında ne yanıtlıyor** — her anahtarda ölçüldü: `POST /v1/chat/completions` `403` `{"error":{"message":"用户额度不足, 剩余额度: ＄0.000000 (request id: …)","type":"new_api_error","code":"insufficient_user_quota"}}` yanıtlıyor — yani hiçbir kimliğin chat-200'ü yok ve işaret tablosu boş kalıyor. Hesaba bakiye yükleyin, aynı anahtar yeniden üretim yapmadan trafiğe hizmet eder.

## 🧪 API'yi kullanma

Temel URL **`https://liangjiewis.com/v1`** — OpenAI uyumlu, yani OpenAI konuşan her şey çalışır (SDK'lar, Cursor, OpenCode, Kilo Code, …).

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

Hesaba bakiye yüklenene kadar bu `403 insufficient_user_quota` yanıtlıyor — ret, anahtarın bir kusuru değil, hesabın bakiyesidir.

## 🛠 Hızlı başlangıç

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

Anahtarlar, bir anahtar `GET /v1/models` 200 yanıtladıktan *ve* onun için bir model çağrısı geri döndükten sonra `keys.txt` dosyasına satır başına bir tane eklenir — buradaki yeni bir hesapta bu çağrı kredi reddidir, tam olarak bu şekilde kaydedilir ve anahtarı esirgemez. Hesaplar birbiri ardına çalışır; `--count 10` uzun bir çalışmadır ve `out/pinned-<date>.log` bunun sürekli kaydıdır. Panele, `proxies.txt` içindeki bir çıkıştan geçmeyen hiçbir şey gönderilmez.

### 🖱️ Başlatıcı

```bash
node src/launcher.js
```

Görev modülleri üzerinde bir menü: **mint**, **verify**, **9Router**. `count` (çalışma başına anahtar) ve `parallel exits` değerlerini sorar, bunları `launcher.config.json` içinde tutar ve `node src/cli.js <task>` komutunu doğru bayraklarla başlatır. Menü öğesi **6** doğrudan 9Router kaydını çalıştırır.

## ✅ Doğrulandı — her anahtar test edilir

Ölçüm **2026-10-15**: **3 hesap → 3 anahtar, hesap başına bir anahtar**. Her anahtar var olduktan sonra, üretimden *bağımsız* bir çıkışta kontrol edildi ve her anahtar aynı gün daha sonra yeniden kontrol edildi.

| Model | Canlı (modeller) | Gerçek sohbet çağrısı | Ölçülen |
| --- | --- | --- | --- |
| `claude-3-5-haiku-20241022` | **200** · 97 model | **403** `insufficient_user_quota` (`＄0.000000`) · ✔ **canlı** (13:11'de yeniden kontrol edildi) | 2026-10-15 12:33 |

**Üçü de yazıldığı gibi canlıydı** — 2026-10-15 13:11 UTC'de `src/verify.js` ile yeniden kontrol edildi: **3/3 anahtar `GET /v1/models` 200 yanıtladı** (her biri 97 model, her biri taze bir çıkışta — hiçbiri üretimin değil), **3/3 kredisiz** (`403 insufficient_user_quota`). `GET /v1/models` 200, bir anahtarın *gerçek* olduğunu kanıtlar; tamamlama sütunu yeni bir hesabın ne *harcayabileceğini* gösterir. `node src/cli.js verify` kendi dosyanız için kontrolü yeniden üretir.

## 🧭 Nasıl çalışır

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: liangjiewis.com page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://liangjiewis.com/v1/chat/completions → real content = the key is live
```

| Adım | Çağrı | Notlar |
| --- | --- | --- |
| Kapılar | `GET /api/status` | `email_verification: true` · `turnstile_check: false` · `checkin_enabled: false` · Gmail kabul edilir (düz biçim) |
| Posta kutusu | [Emailnator](https://www.emailnator.com) | hesap başına taze bir Gmail adresi, çıkışlarınız üzerinden okunur |
| Kod gönder | `GET /api/verification?email=<plain>` | `{"success":true}` |
| Kayıt ol | `POST /api/user/register` | `{"success":true}` |
| Giriş yap | `POST /api/user/login` | oturum çerezi + `GET /api/user/self` → `quota: 0` |
| Token | `POST /api/token/` | hesap başına bir anahtar |
| Giriş | `POST /api/user/checkin` | `{"success":false,"message":"签到功能未启用"}` — devre dışı olduğunu doğru şekilde bildirir; kredi yok |
| Kanıtla | `GET /v1/models` + `POST /v1/chat/completions` | her ikisi de gözlemleyen çıkışla kaydedilir; buradaki sohbet reddi *kredi kapısıdır*, anahtar kusuru değil |

## ⚙️ CLI seçenekleri

Tüm kod `src/` içinde — depo kökünden `node src/<file>.js` olarak çalıştırın.

| Araç | Bayraklar |
| --- | --- |
| `src/mint.js` | `--count N` (3) · `--pool FILE` (`proxies.txt`) · `--mail emailnator\|imap` · `--imap-user` / `--imap-pass` (veya `IMAP_USER` / `IMAP_PASS`) · `--mail-address` · `--sender REGEX` (varsayılan `1449683658\|量界智算`) · `--model ID` · `--poll-ms` (2000) · `--code-wait` (300000) · `--max-cycle` (3) · `--scan` (200) · `--scan-conc` (8, en fazla 8) · `--budget` (2400 s) · `--base URL` |
| `src/verify.js` | `--key K` · `--all` · `--model ID` · `--max-tokens` (8) · `--want` (3) · `--pool FILE` · `--base URL` |
| `src/launcher.js` | etkileşimli: mint / verify / settings — `count` ve `concurrency` `launcher.config.json` içinde kalıcıdır |

## 🛰️ Proxy arkasında

* Çıkışlar `proxies.txt` dosyasından gelir (çıkış başına bir satır, `scheme://host:port`, `user:pass@` desteklenir, `#` yorumları yok sayılır). Aynı havuz panel çağrılarını, anahtar doğrulamasını ve posta kutusu okumalarını besler; araçlar sağlayıcıya asla doğrudan bağlanmaz.
* **Tarama işin kendisidir.** Her hesap, panel ana bilgisayarına karşı `GET /api/status` kanıtlayan ilk çıkışı sabitler ve doğrulama *farklı* bir kanıtlanmış çıkışı sabitler — ölü bir çıkış kendini devre dışı bırakır ve hesap bir sonrakinde devam eder.
* Posta kutusu ([Emailnator](https://www.emailnator.com)) panel yerine üçüncü taraf bir geçici posta hizmetidir; API'si de çıkışlarınız üzerinden okunur.
* Doğrulama postası **`1449683658@qq.com`** adresinden gelir (`量界智算邮箱验证邮件`) — panel alan adından değil — bu yüzden varsayılan `--sender` bu göndereni sabitler, böylece paylaşılan bir kutudan bir yabancının kodu asla gönderilemez.

## 📄 Dosyalar

| Yol | İçerik |
| --- | --- |
| `keys.txt` | satır başına bir canlı doğrulanmış anahtar — git tarafından yok sayılır |
| `accounts.json` | posta kutusu, adımlar, giriş, hesap başına her iki doğrulama çıkışı — git tarafından yok sayılır |
| `models.json` | çalışma başına taze bir `/v1/models` kaydı — git tarafından yok sayılır |
| `proxies.txt` | çıkışlarınız, satır başına bir tane — git tarafından yok sayılır |
| `out/pinned-<date>.log` | çalışma başına günlük (çıkış, zamanlama, tam sunucu yanıtı) — git tarafından yok sayılır |
| `src/mint.js` · `src/verify.js` | CLI'nin yönlendirdiği iki motor |
| `src/connect-9router.js` | `keys.txt` içindeki anahtarları 9Router bağlantıları olarak kaydeder |

## 🔌 9Router'a bağlan

[9Router](https://9router.com) kendi kendine barındırılan, OpenAI uyumlu bir yönlendiricidir. liangjiewis.com OpenAI uyumlu, bu yüzden bir kez kaydedin ve her anahtarı kullanın:

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
# or: node src/cli.js mint --count 3 --connect-9router
```

`keys.txt` içindeki her anahtar `liangjiewis` sağlayıcı düğümünün bir bağlantısı olur (`--api-key <key>` bunun yerine tek bir anahtar kaydeder, `--model <id>` varsayılanı geçersiz kılar). Ardından 9Router içinde bir model seçin:

```
liangjiewis/claude-3-5-haiku-20241022
liangjiewis/claude-opus-5
liangjiewis/gpt-5.5
```

Varsayılanlar: `--base http://localhost:20128`, `--password 123456`, `--prefix liangjiewis`, `--base-url https://liangjiewis.com/v1`, varsayılan model `claude-3-5-haiku-20241022`.

## 🔑 Bir anahtar size ne kazandırır

| | |
| --- | --- |
| 🏢 Sağlayıcı | **liangjiewis.com** — [liangjiewis.com](https://liangjiewis.com) |
| 🎁 Sağlayıcının verdiği | 97 model listeleniyor (Claude Opus 5, GPT-5.5, Gemini 3 Pro, O3) — anahtarlar gerçek, çıkarım kredi kapılı |
| 🔑 Bir anahtar size ne kazandırır | kendi hesabına kapsamlı bir API anahtarı: aşağıdaki uç noktada 97 model kimliği, planınızın sınırlarında. Kota **hesapta** yaşar, bu aracın anahtar başına bir hesap oluşturmasının nedeni tam olarak budur |
| 🌐 API biçimi | OpenAI uyumlu: `POST https://liangjiewis.com/v1/chat/completions` |
| 🔒 Verileriniz | yalnızca liangjiewis.com ve yapılandırdığınız posta kutusu arka ucuyla iletişim kurulur; anahtarlar makinenizde kalır |

## 🐞 Sorunlar

Başarısız adım ve çalışma günlüğü kuyruğu (`out/pinned-<date>.log`) ile bir sorun açın — çıkışı, zamanlamayı ve tam sunucu yanıtını taşır, bu da bir hatayı yeniden üretmek için gereken her şeydir. Asla bir anahtar eklemeyin. **[Bir sorun açın](../../issues)** ve PR'lar memnuniyetle karşılanır.

## 📄 Lisans

MIT © 2026 — bkz. [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 liangjiewis-bulk-apikey katkıda bulunanlar

</div>