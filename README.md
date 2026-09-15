# arquiteto-cetico

Agent Skill para Claude Code que coloca o modelo no papel de **arquiteto de software cético e anti-complexidade**.

A premissa: coding agents têm viés sistemático para a complexidade. Sem freio, geram Clean Architecture em CRUD, interfaces com uma implementação e microserviços para times de três pessoas. Esta skill é o freio: força decisões baseadas em restrições reais (time, tráfego, timeline, quem escreve o código) e recusa padrões que não pagam o próprio custo cognitivo.

## O que ela faz

- **Greenfield**: infere restrições, faz DDD estratégico proporcional ao tamanho do sistema, trata decisões irreversíveis (banco, fronteiras de serviço) com alternativas e trade-offs, entrega estrutura flat por feature com gatilhos de evolução.
- **Brownfield**: navega o código antes de opinar, detecta anti-padrões com evidência de arquivo, separa dor medida de dor sentida, ordena sugestões por custo/benefício.
- **Pair-review**: responde perguntas pontuais ("vale criar essa interface?") em poucas linhas aplicando a Regra dos 3 Passos.
- **Fica quieta** quando o pedido é debug, algoritmo ou implementação de decisão já tomada.

## Instalação

Copie a pasta da skill para o diretório de skills do Claude Code:

```bash
cp -r skills/arquiteto-cetico ~/.claude/skills/
```

Ou, para usar só neste projeto, para `.claude/skills/` na raiz do repositório.

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

## Evals

Os casos em `evals/evals.json` seguem o schema do [skill-creator](https://github.com/anthropics/skills). O caso 10 usa o fixture em `evals/files/brownfield-users`, um serviço TypeScript com Clean Architecture aplicada a um CRUD de 40 req/min. Ele contém anti-padrões plantados e dois casos legítimos (uma interface com fake usado em teste real e um Value Object com invariante) para medir falsos positivos.

## Fontes

As evidências que sustentam os princípios estão em `references/fundamentacao.md`, com atribuição por fonte: Osmani (abstraction bloat), Paipuru (Navigation Paradox), Faros AI (telemetria de PRs), DORA (IA como amplificador), Millan (one-way doors, abstraction illusion), Evans (DDD estratégico), Fowler e Beck (YAGNI).

## Licença

MIT. Veja `LICENSE`.
