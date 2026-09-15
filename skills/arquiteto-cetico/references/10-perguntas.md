# As 10 Perguntas antes de qualquer decisão arquitetural

Adaptadas de Johannes Millan, *AI and Software Architecture: A Dangerous Convenience* (Super Productivity, fev/2026).

O agente aplica esta lista a **toda sugestão que ele mesmo fizer** (antes de oferecê-la), e também pede ao usuário que aplique quando o usuário propuser algo estrutural. As perguntas são referidas como **Pergunta 1 a Pergunta 10** — não confundir com os princípios P1-P7 nem com os passos 1-3 da Regra dos 3 Passos do SKILL.md. Use em:

- Decisões one-way door (banco, fronteira de serviço, protocolo de API).
- Propostas de microserviços, Event Sourcing, CQRS, Clean Architecture completa.
- Refatorações estruturais grandes em modo brownfield.
- Qualquer vez que o usuário diga "estou pensando em adicionar X" onde X é uma camada ou padrão.

## As perguntas

**1. Que problema específico isso resolve?**
Não uma categoria geral ("escalabilidade", "manutenibilidade"). Um problema concreto, experimentado ou medido. "Temos 400ms de latência no endpoint /orders que está violando SLO em 5% das requisições" é problema. "Queremos ser escaláveis" não é.

**2. Qual a alternativa mais simples?**
Um monolito resolveria? Um único banco? Uma função? Antes de adicionar, perguntar o que seria **removido** ou **não-adicionado** se a gente fosse mais simples.

**3. Qual o custo operacional?**
Infra, monitoramento, debug, *onboarding* de novos membros. Quantas horas/mês essa decisão consome de alguém em regime permanente?

**4. O time consegue manter isso?** ⭐ *(uma das duas mais críticas)*
Tem *skill* e ferramentas para os modos de falha **desta** arquitetura? Sabe debugar? Sabe fazer *rollback*? Sabe diagnosticar *performance issue*? Se a resposta for "vamos aprender", isso é um custo, não uma solução.

**5. O que acontece em 10x a escala atual?**
A arquitetura **ajuda** ou só **soma overhead**? Microserviços em 10x tráfego ajudam se a bottleneck é computacional específica; atrapalham se a bottleneck é o próprio overhead de rede/serialização que microserviços introduziram.

**6. Qual o raio de explosão de uma falha?**
Quando um componente quebra, o que mais quebra? Monolito tem raio grande mas previsível. Microserviços podem ter raio menor *ou* maior dependendo de como foram cortados — mal cortados, uma queda do serviço de "user profile" derruba login, pedido, carrinho e checkout.

**7. Como se testa isso ponta a ponta?**
Dá para rodar o sistema inteiro localmente? Se a resposta é "só em staging", o *feedback loop* já é dolorido. Se a resposta é "precisa de cluster Kubernetes e 8GB de RAM", devs júnior vão sofrer.

**8. Como se deploya uma mudança?**
Qual o caminho de commit a produção? Quantos passos manuais? Qual o tempo médio? Quem tem permissão? Se o fluxo envolve escrever Jira, ping no Slack, reunião com SRE e janela de *deploy* às 3h da manhã, a arquitetura está amplificando a fricção.

**9. Como se depura um problema transversal?**
Quando algo dá errado e o erro começa em /checkout mas a causa é um *timeout* em três serviços de distância, como se rastreia? *Distributed tracing* instalado? *Correlation ID* propagado? Logs centralizados? Se não, a arquitetura distribuída é um gerador de bugs invisíveis.

**10. Qual o caminho de volta?** ⭐ *(uma das duas mais críticas)*
Se essa arquitetura se mostrar errada, quão difícil é simplificar? Monolito → microserviços é caminho conhecido e documentado. Microserviços → monolito é refactor dolorido que poucos times já fizeram bem. Event Sourcing → estado normal: praticamente reescrita. Tecnologia de banco é one-way door por definição.

## Regra de uso

Se o usuário (ou o próprio agente) **não consegue responder a maioria dessas perguntas com precisão**, a arquitetura é **prematura**. Simplificar.

As perguntas **4** e **10** são as mais críticas: **capacidade de manter + capacidade de recuar**. Uma arquitetura que o time não consegue manter e da qual não sabe recuar é uma *trap* — e o custo de estar nela é pago todo dia, em cada feature nova.

## Como aplicar em pair-review (forma curta)

Quando o usuário propõe algo estrutural e o agente não quer desacelerar a conversa com 10 perguntas, versão curta:

- "Qual a dor medida que isso resolve?" (= Pergunta 1)
- "Qual é a alternativa mais simples e por que ela não serve?" (= Pergunta 2)
- "Se der errado, qual é o caminho de volta?" (= Pergunta 10)

Se o usuário responde bem as três, provavelmente as outras 7 também estão bem pensadas. Se tropeça em qualquer uma, abrir a conversa para as 10.

## O que NÃO fazer com estas perguntas

- Não usar como *checklist burocrático* para barrar qualquer decisão. A ideia é forçar reflexão, não criar atrito.
- Não perguntar todas as 10 quando o contexto é óbvio. Em refactor pequeno e local, as Perguntas 1 e 10 bastam.
- Não fingir que as respostas são binárias. "Até que ponto o time consegue manter?" é uma pergunta de **grau**.
