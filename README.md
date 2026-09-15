# arquiteto-cetico

Agent Skill que coloca o coding agent no papel de **arquiteto de software cético e anti-complexidade**.

A premissa: coding agents têm viés sistemático para a complexidade. Sem freio, geram Clean Architecture em CRUD, interfaces com uma implementação e microserviços para times de três pessoas. Esta skill é o freio: força decisões baseadas em restrições reais (time, tráfego, timeline, quem escreve o código) e recusa padrões que não pagam o próprio custo cognitivo.

A skill segue o formato aberto [Agent Skills](https://agentskills.io/specification) e funciona sem modificação em **Claude Code, OpenAI Codex, OpenCode, Cursor, Gemini CLI e GitHub Copilot**. O que muda entre ferramentas é só o diretório de instalação e a forma de invocar.

## O que ela faz

- **Greenfield**: infere restrições, faz DDD estratégico proporcional ao tamanho do sistema, trata decisões irreversíveis (banco, fronteiras de serviço) com alternativas e trade-offs, entrega estrutura flat por feature com gatilhos de evolução.
- **Brownfield**: navega o código antes de opinar, detecta anti-padrões com evidência de arquivo, separa dor medida de dor sentida, ordena sugestões por custo/benefício.
- **Pair-review**: responde perguntas pontuais ("vale criar essa interface?") em poucas linhas aplicando a Regra dos 3 Passos.
- **Fica quieta** quando o pedido é debug, algoritmo ou implementação de decisão já tomada.

## Instalação

### Via instalador (recomendado)

O [skills CLI](https://github.com/vercel-labs/skills) detecta as ferramentas instaladas na máquina e copia a skill para o diretório de cada uma:

```bash
# instala em todos os agentes detectados, no projeto atual
npx skills add alexandrejunqueira/arquiteto-cetico

# só para alguns agentes, ou globalmente (-g)
npx skills add alexandrejunqueira/arquiteto-cetico -a codex -a opencode -g
```

Alternativa com o GitHub CLI (`--agent` escolhe o destino; o padrão é Copilot):

```bash
gh skill install alexandrejunqueira/arquiteto-cetico
```

A partir de um clone local, aponte para a pasta da skill:

```bash
npx skills add ./skills/arquiteto-cetico -g
```

### Manual

Copie a pasta `skills/arquiteto-cetico` para o diretório que a sua ferramenta lê. Global vale em qualquer projeto; projeto vale só naquele repositório.

| Ferramenta | Global | Projeto |
|---|---|---|
| Claude Code | `~/.claude/skills/` | `.claude/skills/` |
| OpenAI Codex | `~/.agents/skills/` ou `~/.codex/skills/` | `.agents/skills/` |
| OpenCode | `~/.config/opencode/skills/` ou `~/.agents/skills/` | `.opencode/skills/` ou `.agents/skills/` |
| Cursor | `~/.cursor/skills/` ou `~/.agents/skills/` | `.cursor/skills/` ou `.agents/skills/` |
| Gemini CLI | `~/.gemini/skills/` ou `~/.agents/skills/` | `.gemini/skills/` ou `.agents/skills/` |
| GitHub Copilot | `~/.copilot/skills/` ou `~/.agents/skills/` | `.github/skills/` ou `.agents/skills/` |

`~/.agents/skills/` é lido por todas as ferramentas acima exceto o Claude Code. Um symlink `~/.claude/skills -> ~/.agents/skills` resolve isso e deixa um único diretório de skills na máquina. Este repositório usa o mesmo truque em nível de projeto: `.agents/skills/arquiteto-cetico` é um symlink para `skills/arquiteto-cetico`, e `.claude/skills` aponta para `.agents/skills`.

```bash
# exemplo: instalação global manual para Claude Code
cp -r skills/arquiteto-cetico ~/.claude/skills/
```

### Como invocar

Em todas as ferramentas a skill é ativada automaticamente quando o pedido bate com a `description` (arquitetura, DDD, Clean Architecture, microserviços, "vale criar essa interface?" etc.). Para forçar:

| Ferramenta | Invocação explícita |
|---|---|
| Claude Code | `/arquiteto-cetico` |
| OpenAI Codex | `$arquiteto-cetico` |
| Cursor | `/arquiteto-cetico` |
| OpenCode | o agente chama o tool `skill` com o nome |
| Gemini CLI | o agente chama `activate_skill`; pede consentimento na primeira ativação |
| GitHub Copilot | automática pela `description` |

## Estrutura

```
skills/arquiteto-cetico/
  SKILL.md                    # instruções principais (cobre ~80% dos casos)
  references/
    anti-padroes.md           # tabela de detecção + falsos positivos
    10-perguntas.md           # checklist antes de decisão estrutural
    adr-template.md           # formato Nygard
    restricoes.md             # lista completa de restrições
    debates.md                # posições sobre debates recorrentes
    fundamentacao.md          # evidências e fontes (única cópia dos números)
  evals/
    evals.json                # 11 casos, expectativas semânticas
    files/brownfield-users/   # fixture com anti-padrões plantados
```

`evals/` é usado pelo [skill-creator](https://github.com/anthropics/skills) e ignorado pelas demais ferramentas. `.claude-plugin/plugin.json` na raiz do repositório existe para o marketplace de plugins do Claude Code e serve de manifesto para o skills CLI; também é ignorado pelas outras ferramentas.

## Compatibilidade

- O frontmatter do `SKILL.md` usa apenas campos do spec (`name`, `description`, `license`, `metadata`). Nenhum campo exclusivo de uma ferramenta.
- O corpo não depende de tool, hook, servidor MCP ou slash command. As referências a `references/*.md` são caminhos relativos à raiz da skill, como o spec pede.
- Em modo brownfield a skill pede para navegar o código antes de opinar. Isso funciona em qualquer ferramenta que dê ao agente leitura de arquivos, que é o caso de todas as listadas.

## Evals

Os casos em `evals/evals.json` seguem o schema do [skill-creator](https://github.com/anthropics/skills). O caso 10 usa o fixture em `evals/files/brownfield-users`, um serviço TypeScript com Clean Architecture aplicada a um CRUD de 40 req/min. Ele contém anti-padrões plantados e dois casos legítimos (uma interface com fake usado em teste real e um Value Object com invariante) para medir falsos positivos.

## Fontes

As evidências que sustentam os princípios estão em `references/fundamentacao.md`, com atribuição por fonte: Osmani (abstraction bloat), Paipuru (Navigation Paradox), Faros AI (telemetria de PRs), DORA (IA como amplificador), Millan (one-way doors, abstraction illusion), Evans (DDD estratégico), Fowler e Beck (YAGNI).

## Licença

MIT. Veja `LICENSE`.
