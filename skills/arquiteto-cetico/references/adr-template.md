# Template de Architecture Decision Record (ADR)

Formato Michael Nygard — curto, descritivo, honesto sobre o preço pago.

Use em:

- **Greenfield**: uma ADR para cada decisão one-way door (banco, comunicação entre contextos, deployment, linguagem, protocolo de API pública).
- **Brownfield**: ADR retroativo para decisões estruturais grandes — documentar por que o sistema é como é, mesmo que a decisão original não tenha sido registrada na época.
- **Desacordo com o usuário**: quando o agente recomendou A, o usuário escolheu B, e a decisão é irreversível. Documenta a decisão contrária junto do motivo para o futuro-eu do usuário saber por que foi feito assim.

## Template

```markdown
# ADR NNNN: <Título curto e específico da decisão>

## Status
<Proposta | Aceita | Substituída por ADR-MMMM | Obsoleta>

Data: <YYYY-MM-DD>

## Contexto

<As forças em jogo: técnicas, políticas, sociais, de projeto.
Neutro, descritivo — escreva como se fosse um relato, sem defender
ainda a decisão. 2-4 parágrafos.

Inclua aqui as restrições específicas que deram forma à decisão:
tamanho do time, perfil de tráfego, timeline, requisitos regulatórios,
capacidade operacional, quem escreve o código.>

## Decisão

<A decisão. Voz ativa, pessoa verbal clara: "Escolhemos X".
Sem *hedging*. Uma sentença objetiva seguida, se necessário, de
uma lista curta de detalhes concretos da escolha.>

## Consequências

### Positivas
- <O que fica mais fácil, mais rápido, mais seguro ou mais barato.>

### Negativas
- <O que fica mais difícil, mais caro, mais arriscado ou mais lento.
  Seja honesto. Uma ADR que só lista consequências positivas é
  um sinal de *motivated reasoning* — toda decisão real tem preço.>

### Neutras
- <Coisas que mudam mas cujo impacto é ambíguo ou dependente de contexto futuro.>

## Alternativas consideradas

### Alternativa A: <Nome curto>
<O que era. Por que foi descartada. Sob quais condições ela voltaria
a ser a melhor opção.>

### Alternativa B: <Nome curto>
<Idem.>

<1 a 3 alternativas. Se você não considerou alternativas de verdade,
 isso em si é um sinal de alerta — volte e considere.>

## Gatilhos de revisão

<Opcional mas recomendado. Condições sob as quais esta ADR deveria
ser reaberta:
- "Quando o time crescer além de N devs"
- "Quando o volume passar de X req/s"
- "Quando surgir requisito de auditoria completa"
- "Quando Y serviço externo deixar de ser mantido"
>
```

## Boas práticas ao escrever

- **Título específico**: "ADR-0003: Usar Postgres como banco primário" é melhor que "ADR-0003: Escolha do banco".
- **Contexto honesto**: se a decisão foi tomada com informação incompleta, diga isso no contexto. Futuro-você vai agradecer.
- **Não embeleze alternativas**: se você descartou microserviços porque o time não tinha SRE, escreva isso. Não minta dizendo "microserviços não atendiam aos requisitos funcionais".
- **Registre consequências negativas reais**: "Migrar de Postgres para outro banco será um refactor grande" é consequência honesta.
- **Imutável depois de "Aceita"**: se a decisão mudar, crie uma nova ADR que *substitui* a anterior e atualize o status da antiga para "Substituída por ADR-NNNN". Não edite o conteúdo original.

## Numeração

Números sequenciais simples, com zero à esquerda: `ADR-0001`, `ADR-0002`, etc. Guarde em `docs/adr/` ou equivalente no repositório. Um arquivo por ADR.

## Exemplo curto

```markdown
# ADR-0001: Usar Postgres como banco primário para o core

## Status
Aceita

Data: 2026-04-20

## Contexto

Time de 4 devs full-stack, sem SRE. MVP previsto para 12 semanas, com
tração esperada para 6 meses. Domínio tem relações fortes (usuários,
pedidos, pagamentos, itens) e requisitos de consistência transacional
em pagamento e geração de pedido. Nenhum requisito de *ultra-low latency*
ou escrita massiva identificado. Time tem experiência prévia com SQL;
um dev tem experiência com MongoDB mas não em produção.

## Decisão

Escolhemos Postgres 16 como banco primário, hospedado em managed service
(Neon ou Supabase, decisão secundária em ADR-0002). Usar Prisma como
ORM, acessado diretamente nos pacotes de cada bounded context (sem
Repository Pattern adicional).

## Consequências

### Positivas
- Consistência transacional *out of the box* para pagamento/pedido.
- ORM maduro, ecossistema grande, AI consegue navegar bem em código Prisma.
- Time consegue manter — SQL é habilidade conhecida.

### Negativas
- Escrita massiva (se vier) exigirá *read replicas* ou cache explícito.
- Se um contexto específico depois precisar de *document store* (ex.: log
  de eventos, search), será um segundo datastore — aceitável.

## Alternativas consideradas

### MongoDB
Descartado: time sem experiência de produção; domínio tem relações fortes
que forçariam *joins* manuais; consistência eventual complica pagamento.

### Um Postgres por bounded context
Descartado para MVP: overhead operacional alto para time de 4 sem SRE.
Reconsiderar quando um contexto específico tiver requisito de escala
divergente do resto.

## Gatilhos de revisão
- Volume de escrita > 500 writes/s sustentado no core.
- Aparecimento de requisito de *full-text search* avançado.
- Time cresce e contrata SRE.
```

## Quando NÃO usar ADR

Para decisões *two-way door* pequenas — escolha de lib de data, formato de log, estrutura de pastas local — ADR é *overhead*. Use ADR quando a decisão é irreversível ou cara de reverter, ou quando você sabe que vai precisar justificá-la para alguém que chegar depois.
