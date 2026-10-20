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

**자동 생성된 API 키로 liangjiewis.com 계정을 대량 생성 — OpenAI 호환 추론(Claude, GPT, Gemini, DeepSeek, GLM, Qwen) + 9Router 커넥터.**

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

## ✨ 왜 이 프로젝트가 존재하나요

liangjiewis.com(量界智算)은 **97개 모델**을 나열하고 가입을 이메일로만 제한합니다 — **캡차 없음**(`turnstile_check: false`). 새 계정은 **`quota 0`(`＄0.000000`)**에 도달하며 **일일 체크인 없음**(`签到功能未启用`), 129행 가격표에 **가격 0 모델 0개**이므로, 발급된 모든 키는 *정품*이고(`GET /v1/models` **200**) *크레딧 게이트*됩니다(`POST /v1/chat/completions` **403** `insufficient_user_quota`). 키 하나당 계정 하나; N개 키 = N개 계정, 각각 자체 예산.

## 🎁 무료 티어 — 얼마나 받을 수 있나요

**새 liangjiewis.com 계정에는 크레딧이 없습니다 — 이 도구는 계정에 여전히 충전이 필요한 정품 키를 발급합니다.**

| 항목 | 측정값 |
| --- | --- |
| 가입 지급 | **크레딧 없음** — 모든 계정은 `quota 0`(`＄0.000000`)에 도달 |
| 일일 체크인 | **비활성화**(`签到功能未启用`) — 충전 없음 |
| 가격 0 모델 | **없음** — `/api/pricing`(129행, 계정 세션으로 읽음)에는 가격이 0인 모델이 0개 나열됨 |
| 가입 시 캡차 | **없음**(`turnstile_check: false`) |
| 패널이 허용하는 이메일 | 일반 `@gmail.com`(점 없는 형식); `@qq.com`은 거부됨(`550 … non-existent account`); `1449683658`으로 발송(제목 `量界智算邮箱验证邮件`) — `--sender "1449683658\|量界智算"`로 고정 |
| 오늘 발급된 키로 할 수 있는 것 | `GET /v1/models` **200**(97개 모델) — 정품; 충전 전까지 `POST /v1/chat/completions` **403** `insufficient_user_quota` |
| 확장 단위 | **계정 하나 = 키 하나** → `--count N`은 사실상 "N개 계정, 각각 자체 잔액" |

> 💡 무료 티어는 liangjiewis.com이 설정하며 변경될 수 있습니다. 실시간 수치는 [liangjiewis.com](https://liangjiewis.com)에서 확인하세요 — 그리고 도구 자체의 게이트가 판단하게 하세요:

```bash
node src/cli.js verify                 # every key in keys.txt is re-tested against the live API
```

## 🤖 모델 — 97개 전부

`GET https://liangjiewis.com/v1/models`는 발급된 키에 대해 **97개 모델 id**를 반환합니다. 예:

```
claude-opus-5 · claude-sonnet-5 · claude-haiku-4-5-20251001 · claude-3-5-haiku-20241022
gpt-5.5 · gpt-5.4-mini · gpt-5.1-codex-max · gpt-5-codex · gemini-3-pro-preview
gemini-2.5-flash · gemini-3.1-flash-lite-preview · o3 · o3-mini · o4-mini
text-embedding-3-small
```

**새 계정이 모델을 *사용*하려 할 때 응답하는 내용** — 모든 키에서 측정: 계정에 충전되기 전까지 `POST /v1/chat/completions`는 `403` `{"error":{"message":"用户额度不足, 剩余额度: ＄0.000000 (request id: …)","type":"new_api_error","code":"insufficient_user_quota"}}`를 응답합니다. 2026-10-19 저장소 키 재스캔에서 **5개 중 2개가 충전됨**을 발견했습니다: 해당 키들은 아래 id에 `200`을 응답하고, 다른 모든 카탈로그 id는 여전히 크레딧 거부를 반환합니다. 계정을 충전하면 같은 키가 재발급 없이 트래픽을 처리합니다.

|모델|✓|
|---|---|
|`claude-3-5-haiku-20241022`|✓|
|`claude-3-5-sonnet-20240620`|✓|
|`claude-haiku-4-5-20251001`|✓|
|`claude-opus-4-1-20250805`|✓|

## 🧪 API 사용 방법

기본 URL은 **`https://liangjiewis.com/v1`**이며 OpenAI 호환입니다. 따라서 OpenAI를 지원하는 모든 것(SDK, Cursor, OpenCode, Kilo Code, …)이 작동합니다.

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

계정에 충전되기 전까지는 `403 insufficient_user_quota`를 응답합니다 — 이 거부는 계정 잔액 때문이며 키의 결함이 아닙니다.

## 🛠 빠른 시작

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

키는 `GET /v1/models` 200 *그리고* 해당 키에 대한 모델 호출이 돌아온 뒤에만 `keys.txt`에 한 줄에 하나씩 추가됩니다 — 여기서 새 계정의 경우 그 호출은 크레딧 거부이며, 정확히 그대로 기록되고 키를 보류하지 않습니다. 계정은 하나씩 실행됩니다. `--count 10`은 긴 실행이며 `out/pinned-<date>.log`가 그 실행 기록입니다. `proxies.txt`의 출구를 거치지 않고 패널로 전송되는 것은 없습니다.

### 🖱️ 런처

```bash
node src/launcher.js
```

작업 모듈 위의 메뉴: **mint**, **verify**, **9Router**. `count`(실행당 키 수)와 `parallel exits`를 묻고, 이를 `launcher.config.json`에 저장하며, 올바른 플래그로 `node src/cli.js <task>`를 실행합니다. 메뉴 항목 **6**은 9Router 등록을 직접 실행합니다.

## ✅ 작동 검증 완료 — 모든 키가 테스트됩니다

측정 **2026-10-15**: **3개 계정 → 3개 키, 계정당 키 하나**. 모든 키는 존재한 뒤 mint와 *독립적인* 출구에서 검사되었고, 모든 키는 같은 날 나중에 다시 검사되었습니다.

| 모델 | 라이브(models) | 실제 채팅 호출 | 측정 |
| --- | --- | --- | --- |
| `claude-3-5-haiku-20241022` | **200** · 97개 모델 | **403** `insufficient_user_quota` (`＄0.000000`) · ✔ **라이브**(13:11 재확인) | 2026-10-15 12:33 |

**세 개 모두 작성된 그대로 라이브였습니다** — 2026-10-15 13:11 UTC에 `src/verify.js` 자체로 재확인: **3/3 키가 `GET /v1/models` 200 응답**(각각 97개 모델, 각각 새 출구 — mint의 출구 아님), **3/3 크레딧 소진**(`403 insufficient_user_quota`). `GET /v1/models` 200은 키가 *정품*임을 증명하고, completion 열은 새 계정이 *지출*할 수 있는 것을 보여줍니다. `node src/cli.js verify`는 자신의 파일에 대해 이 검사를 재현합니다.

## 🧭 작동 방식

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: liangjiewis.com page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://liangjiewis.com/v1/chat/completions → real content = the key is live
```

| 단계 | 호출 | 비고 |
| --- | --- | --- |
| 게이트 | `GET /api/status` | `email_verification: true` · `turnstile_check: false` · `checkin_enabled: false` · Gmail 허용(일반 형식) |
| 메일함 | [Emailnator](https://www.emailnator.com) | 계정마다 새 Gmail 주소, 출구를 통해 읽음 |
| 코드 전송 | `GET /api/verification?email=<plain>` | `{"success":true}` |
| 등록 | `POST /api/user/register` | `{"success":true}` |
| 로그인 | `POST /api/user/login` | 세션 쿠키 + `GET /api/user/self` → `quota: 0` |
| 토큰 | `POST /api/token/` | 계정당 키 하나 |
| 체크인 | `POST /api/user/checkin` | `{"success":false,"message":"签到功能未启用"}` — 비활성화를 올바르게 보고; 크레딧 없음 |
| 증명 | `GET /v1/models` + `POST /v1/chat/completions` | 둘 다 관찰한 출구와 함께 기록됨; 여기서의 채팅 거부는 *크레딧 게이트*이지 키 결함이 아님 |

## ⚙️ CLI 옵션

모든 코드는 `src/`에 있습니다 — 저장소 루트에서 `node src/<file>.js`로 실행하세요.

| 도구 | 플래그 |
| --- | --- |
| `src/mint.js` | `--count N` (3) · `--pool FILE` (`proxies.txt`) · `--mail emailnator\|imap` · `--imap-user` / `--imap-pass` (or `IMAP_USER` / `IMAP_PASS`) · `--mail-address` · `--sender REGEX` (default `1449683658\|量界智算`) · `--model ID` · `--poll-ms` (2000) · `--code-wait` (300000) · `--max-cycle` (3) · `--scan` (200) · `--scan-conc` (8, max 8) · `--budget` (2400 s) · `--base URL` |
| `src/verify.js` | `--key K` · `--all` · `--model ID` · `--max-tokens` (8) · `--want` (3) · `--pool FILE` · `--base URL` |
| `src/launcher.js` | 대화형: mint / verify / settings — `count`와 `concurrency`는 `launcher.config.json`에 유지됨 |

## 🛰️ 프록시 뒤에서

* 출구는 `proxies.txt`에서 옵니다(출구당 한 줄, `scheme://host:port`, `user:pass@` 지원, `#` 주석 무시). 동일한 풀이 패널 호출, 키 검증, 메일함 읽기에 공급됩니다. 도구는 제공자에게 직접 연결하지 않습니다.
* **선별이 핵심 작업입니다.** 각 계정은 패널 호스트에 대해 `GET /api/status`를 증명하는 첫 출구를 고정하고, 검증은 *다른* 검증된 출구를 고정합니다 — 죽은 출구는 스스로 은퇴하고 계정은 다음 출구에서 계속합니다.
* 메일함([Emailnator](https://www.emailnator.com))은 패널이 아니라 타사 임시 메일 서비스입니다. 해당 API도 출구를 통해 읽습니다.
* 검증 메일은 패널 도메인이 아닌 **`1449683658`** (`量界智算邮箱验证邮件`)에서 도착합니다 — 그래서 기본 `--sender`가 해당 발신자를 고정하여 공유 메일함의 낯선 사람 코드가 제출될 수 없게 합니다.

## 📄 파일

| 경로 | 내용 |
| --- | --- |
| `keys.txt` | 한 줄에 하나의 라이브 검증된 키 — git 무시됨 |
| `accounts.json` | 계정별 메일함, 단계, 체크인, 두 검증 출구 — git 무시됨 |
| `models.json` | 실행당 새 `/v1/models` 캡처 — git 무시됨 |
| `proxies.txt` | 출구, 한 줄에 하나 — git 무시됨 |
| `out/pinned-<date>.log` | 실행별 로그(출구, 타이밍, 정확한 서버 응답) — git 무시됨 |
| `src/mint.js` · `src/verify.js` | CLI가 디스패치하는 두 엔진 |
| `src/connect-9router.js` | `keys.txt`의 키를 9Router 연결로 등록 |

## 🔌 9Router에 연결

[9Router](https://9router.com)는 자체 호스팅되는 OpenAI 호환 라우터입니다. liangjiewis.com은 OpenAI 호환이므로 한 번 등록하고 모든 키를 사용하세요:

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
# or: node src/cli.js mint --count 3 --connect-9router
```

`keys.txt`의 모든 키는 `liangjiewis` 제공자 노드의 연결 하나가 됩니다(대신 `--api-key <key>`는 단일 키를 등록하고, `--model <id>`는 기본값을 재정의합니다). 그런 다음 9Router 안에서 모델을 선택하세요:

```
liangjiewis/claude-3-5-haiku-20241022
liangjiewis/claude-opus-5
liangjiewis/gpt-5.5
```

기본값: `--base http://localhost:20128`, `--password 123456`, `--prefix liangjiewis`, `--base-url https://liangjiewis.com/v1`, 기본 모델 `claude-3-5-haiku-20241022`.

## 🔑 키 하나로 얻는 것

| | |
| --- | --- |
| 🏢 제공자 | **liangjiewis.com** — [liangjiewis.com](https://liangjiewis.com) |
| 🎁 제공자가 주는 것 | 97개 모델 나열(Claude Opus 5, GPT-5.5, Gemini 3 Pro, O3) — 키는 정품, 추론은 크레딧 게이트 |
| 🔑 키 하나로 얻는 것 | 자체 계정에 범위가 지정된 API 키 하나: 아래 엔드포인트의 97개 모델 id, 플랜 한도 내. 할당량은 **계정**에 있으므로 이 도구가 키당 계정 하나를 만드는 것입니다 |
| 🌐 API 형태 | OpenAI 호환: `POST https://liangjiewis.com/v1/chat/completions` |
| 🔒 데이터 | 구성한 liangjiewis.com과 메일함 백엔드에만 접속하며, 키는 사용자 컴퓨터에 남습니다 |

## 🐞 이슈

실패한 단계와 실행 로그 끝부분(`out/pinned-<date>.log`)을 포함해 이슈를 열어 주세요 — 여기에는 출구, 타이밍, 정확한 서버 응답이 담겨 있어 실패를 재현하는 데 필요한 모든 것입니다. 키는 절대 첨부하지 마세요. **[이슈 열기](../../issues)** 그리고 PR을 환영합니다.

## 📄 라이선스

MIT © 2026 — [LICENSE](LICENSE) 참조.

<div align="center">

**[MIT](LICENSE)** © 2026 liangjiewis-bulk-apikey 기여자

</div>