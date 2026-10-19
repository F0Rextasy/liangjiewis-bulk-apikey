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

**Crie contas em massa no liangjiewis.com com chaves de API geradas automaticamente — inferência compatível com OpenAI (Claude, GPT, Gemini, DeepSeek, GLM, Qwen) + conector 9Router.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependências](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![Licença](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Modelos](https://img.shields.io/badge/models-97%20served-412991?style=for-the-badge)](https://liangjiewis.com)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Início rápido](#-quick-start) · [🎁 Nível gratuito](#-free-tier--how-much-you-get) · [🤖 Modelos](#-models--all-97-of-them) · [🧪 Usar a API](#-how-to-use-the-api) · [✅ Verificado](#-verified-working--every-key-is-tested) · [🧭 Como funciona](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Opções](#️-cli-options) · [🛰️ Proxies](#️-behind-a-proxy) · [🐞 Problemas](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>




---

## ✨ Por que isto existe

liangjiewis.com (量界智算) lista **97 modelos** e restringe o cadastro apenas por e-mail — **sem captcha** (`turnstile_check: false`). Uma conta nova fica em **`quota 0` (`＄0.000000`)** **sem check-in diário** (`签到功能未启用`) e **0 modelos com preço zero** em sua tabela de preços de 129 linhas, então toda chave gerada é *autêntica* (`GET /v1/models` **200**) e *limitada por crédito* (`POST /v1/chat/completions` **403** `insufficient_user_quota`). Uma conta por chave; N chaves = N contas, cada uma com seu próprio orçamento.

## 🎁 Nível gratuito — quanto você recebe

**Uma conta nova no liangjiewis.com não traz crédito — a ferramenta gera chaves autênticas cuja conta ainda precisa de recarga.**

| Item | Medido |
| --- | --- |
| Concessão no cadastro | **sem crédito** — toda conta fica em `quota 0` (`＄0.000000`) |
| Check-in diário | **desativado** (`签到功能未启用`) — sem recarga |
| Modelos com preço zero | **nenhum** — `/api/pricing` (129 linhas, lidas com uma sessão de conta) lista 0 modelo com preço zero |
| Captcha no cadastro | **nenhum** (`turnstile_check: false`) |
| E-mail que o painel aceita | `@gmail.com` comum (forma sem ponto); `@qq.com` é recusado (`550 … non-existent account`); o envio ocorre via `1449683658@qq.com` (assunto `量界智算邮箱验证邮件`) — fixe-o com `--sender "1449683658\|量界智算"` |
| O que uma chave gerada pode fazer hoje | `GET /v1/models` **200** (97 modelos) — autêntica; `POST /v1/chat/completions` **403** `insufficient_user_quota` até receber crédito |
| A unidade que escala | **uma conta = uma chave** → `--count N` na prática significa "N contas, cada uma com seu próprio saldo" |

> 💡 O nível gratuito é definido pelo liangjiewis.com e pode mudar. Confira os números atuais em [liangjiewis.com](https://liangjiewis.com) — e deixe a própria verificação da ferramenta decidir:

```bash
node src/cli.js verify                 # every key in keys.txt is re-tested against the live API
```

## 🤖 Modelos — todos os 97

`GET https://liangjiewis.com/v1/models` retorna **97 ids de modelo** para uma chave gerada, por exemplo:

```
claude-opus-5 · claude-sonnet-5 · claude-haiku-4-5-20251001 · claude-3-5-haiku-20241022
gpt-5.5 · gpt-5.4-mini · gpt-5.1-codex-max · gpt-5-codex · gemini-3-pro-preview
gemini-2.5-flash · gemini-3.1-flash-lite-preview · o3 · o3-mini · o4-mini
text-embedding-3-small
```

**O que uma conta nova responde quando tenta *usar* um modelo** — medido em cada chave: `POST /v1/chat/completions` responde `403` `{"error":{"message":"用户额度不足, 剩余额度: ＄0.000000 (request id: …)","type":"new_api_error","code":"insufficient_user_quota"}}` até que a conta receba crédito. Uma nova varredura das chaves do repositório em 2026-10-19 encontrou **2 de 5 com crédito**: essas chaves respondem `200` nos ids abaixo, enquanto todos os outros ids do catálogo ainda retornam a recusa por crédito. Recarregue a conta e a mesma chave atenderá tráfego sem gerar outra.

|Modelo|✓|
|---|---|
|`claude-3-5-haiku-20241022`|✓|
|`claude-3-5-sonnet-20240620`|✓|
|`claude-haiku-4-5-20251001`|✓|
|`claude-opus-4-1-20250805`|✓|

## 🧪 Como usar a API

A URL base é **`https://liangjiewis.com/v1`** — compatível com OpenAI, então qualquer coisa que fale OpenAI funciona (SDKs, Cursor, OpenCode, Kilo Code, …).

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

Até que a conta receba crédito, isso responde `403 insufficient_user_quota` — a recusa é o saldo da conta, não um defeito da chave.

## 🛠 Início rápido

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

As chaves são anexadas a `keys.txt`, uma por linha, depois que uma chave respondeu `GET /v1/models` 200 *e* uma chamada de modelo retornou para ela — em uma conta nova aqui essa chamada é a recusa por crédito, que é registrada exatamente como tal e não impede a chave. As contas são executadas uma após a outra; `--count 10` é uma execução longa, e `out/pinned-<date>.log` é o registro contínuo dela. Nada é enviado ao painel sem passar por uma saída de `proxies.txt`.

### 🖱️ O launcher

```bash
node src/launcher.js
```

Um menu sobre os módulos de tarefa: **mint**, **verify**, **9Router**. Ele pergunta `count` (chaves por execução) e `parallel exits`, mantém esses valores em `launcher.config.json` e inicia `node src/cli.js <task>` com as opções corretas. O item **6** do menu executa diretamente o cadastro no 9Router.

## ✅ Verificado e funcionando — cada chave é testada

Medido em **2026-10-15**: **3 contas → 3 chaves, uma chave por conta**. Cada chave foi verificada depois de existir, em uma saída *independente* da geração, e cada chave foi verificada novamente mais tarde no mesmo dia.

| Modelo | Ativo (modelos) | Chamada de chat real | Medido |
| --- | --- | --- | --- |
| `claude-3-5-haiku-20241022` | **200** · 97 modelos | **403** `insufficient_user_quota` (`＄0.000000`) · ✔ **ativa** (reverificada às 13:11) | 2026-10-15 12:33 |

**Todas as três estavam ativas conforme registrado** — reverificadas em 2026-10-15 13:11 UTC com o próprio `src/verify.js`: **3/3 chaves responderam `GET /v1/models` 200** (97 modelos cada, cada uma em uma saída nova — nenhuma a da geração), **3/3 sem crédito** (`403 insufficient_user_quota`). `GET /v1/models` 200 prova que uma chave é *autêntica*; a coluna de conclusão mostra o que uma conta nova pode *gastar*. `node src/cli.js verify` reproduz a verificação para o seu próprio arquivo.

## 🧭 Como funciona

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: liangjiewis.com page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://liangjiewis.com/v1/chat/completions → real content = the key is live
```

| Etapa | Chamada | Observações |
| --- | --- | --- |
| Barreiras | `GET /api/status` | `email_verification: true` · `turnstile_check: false` · `checkin_enabled: false` · Gmail aceito (forma sem ponto) |
| Caixa de entrada | [Emailnator](https://www.emailnator.com) | um endereço Gmail novo por conta, lido pelas suas saídas |
| Enviar código | `GET /api/verification?email=<plain>` | `{"success":true}` |
| Registrar | `POST /api/user/register` | `{"success":true}` |
| Login | `POST /api/user/login` | cookie de sessão + `GET /api/user/self` → `quota: 0` |
| Token | `POST /api/token/` | uma chave por conta |
| Check-in | `POST /api/user/checkin` | `{"success":false,"message":"签到功能未启用"}` — relata corretamente que está desativado; sem crédito |
| Comprovar | `GET /v1/models` + `POST /v1/chat/completions` | ambos registrados com a saída observadora; a recusa de chat aqui é a *barreira de crédito*, não um defeito da chave |

## ⚙️ Opções da CLI

Todo o código fica em `src/` — execute a partir da raiz do repositório como `node src/<file>.js`.

| Ferramenta | Opções |
| --- | --- |
| `src/mint.js` | `--count N` (3) · `--pool FILE` (`proxies.txt`) · `--mail emailnator\|imap` · `--imap-user` / `--imap-pass` (ou `IMAP_USER` / `IMAP_PASS`) · `--mail-address` · `--sender REGEX` (padrão `1449683658\|量界智算`) · `--model ID` · `--poll-ms` (2000) · `--code-wait` (300000) · `--max-cycle` (3) · `--scan` (200) · `--scan-conc` (8, máx. 8) · `--budget` (2400 s) · `--base URL` |
| `src/verify.js` | `--key K` · `--all` · `--model ID` · `--max-tokens` (8) · `--want` (3) · `--pool FILE` · `--base URL` |
| `src/launcher.js` | interativo: mint / verify / configurações — `count` e `concurrency` persistem em `launcher.config.json` |

## 🛰️ Atrás de um proxy

* As saídas vêm de `proxies.txt` (uma linha por saída, `scheme://host:port`, `user:pass@` aceito, comentários `#` ignorados). O mesmo pool alimenta as chamadas ao painel, a verificação das chaves e as leituras da caixa de entrada; as ferramentas nunca acessam o provedor diretamente.
* **A triagem é o trabalho.** Cada conta fixa a primeira saída que comprova `GET /api/status` contra o host do painel, e a verificação fixa uma saída comprovada *diferente* — uma saída morta se aposenta sozinha e a conta continua na próxima.
* A caixa de entrada ([Emailnator](https://www.emailnator.com)) é um serviço de e-mail temporário de terceiros, não o painel; sua API também é lida pelas suas saídas.
* O e-mail de verificação chega de **`1449683658@qq.com`** (`量界智算邮箱验证邮件`) — não do domínio do painel —, e é por isso que o `--sender` padrão fixa esse remetente, para que o código de um estranho em uma caixa compartilhada nunca possa ser enviado.

## 📄 Arquivos

| Caminho | Conteúdo |
| --- | --- |
| `keys.txt` | uma chave verificada e ativa por linha — ignorada pelo git |
| `accounts.json` | caixa de entrada, etapas, check-in, ambas as saídas de verificação por conta — ignorado pelo git |
| `models.json` | uma captura nova de `/v1/models` por execução — ignorado pelo git |
| `proxies.txt` | suas saídas, uma por linha — ignorado pelo git |
| `out/pinned-<date>.log` | o log por execução (saída, tempo, resposta exata do servidor) — ignorado pelo git |
| `src/mint.js` · `src/verify.js` | os dois motores para os quais a CLI encaminha |
| `src/connect-9router.js` | registra as chaves em `keys.txt` como conexões do 9Router |

## 🔌 Conectar ao 9Router

[9Router](https://9router.com) é um roteador auto-hospedado e compatível com OpenAI. O liangjiewis.com é compatível com OpenAI, então registre-o uma vez e use todas as chaves:

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
# or: node src/cli.js mint --count 3 --connect-9router
```

Cada chave em `keys.txt` se torna uma conexão do nó provedor `liangjiewis` (`--api-key <key>` registra uma única chave, `--model <id>` substitui o padrão). Depois, escolha um modelo dentro do 9Router:

```
liangjiewis/claude-3-5-haiku-20241022
liangjiewis/claude-opus-5
liangjiewis/gpt-5.5
```

Padrões: `--base http://localhost:20128`, `--password 123456`, `--prefix liangjiewis`, `--base-url https://liangjiewis.com/v1`, modelo padrão `claude-3-5-haiku-20241022`.

## 🔑 O que uma chave oferece

| | |
| --- | --- |
| 🏢 Provedor | **liangjiewis.com** — [liangjiewis.com](https://liangjiewis.com) |
| 🎁 O que o provedor oferece | 97 modelos listados (Claude Opus 5, GPT-5.5, Gemini 3 Pro, O3) — chaves autênticas, inferência limitada por crédito |
| 🔑 O que uma chave oferece | uma chave de API restrita à própria conta: os 97 ids de modelo no endpoint abaixo, nos limites do seu plano. A cota fica na **conta**, que é exatamente por isso que esta ferramenta cria uma conta por chave |
| 🌐 Formato da API | compatível com OpenAI: `POST https://liangjiewis.com/v1/chat/completions` |
| 🔒 Seus dados | apenas liangjiewis.com e o backend de caixa de entrada que você configurar são contatados; as chaves ficam na sua máquina |

## 🐞 Problemas

Abra uma issue com a etapa que falhou e o final do log da execução (`out/pinned-<date>.log`) — ele contém a saída, o tempo e a resposta exata do servidor, que é tudo o que é necessário para reproduzir uma falha. Nunca anexe uma chave. **[Abra uma issue](../../issues)** e PRs são bem-vindos.

## 📄 Licença

MIT © 2026 — veja [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 colaboradores do liangjiewis-bulk-apikey

</div>