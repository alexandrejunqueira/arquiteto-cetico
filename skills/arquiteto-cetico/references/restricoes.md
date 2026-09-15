# Restrições — lista completa e como elas mudam a recomendação

O SKILL.md orienta o agente a **inferir** restrições do contexto e **perguntar só o que bloqueia** a recomendação. Este arquivo é a lista completa — use quando:

- Você está fazendo um desenho greenfield formal e quer checar se cobriu o essencial.
- O usuário pede explicitamente uma "entrevista de arquitetura" ou "discovery".
- Você está prestes a recomendar algo one-way door e quer ter certeza de que cobriu os fatores relevantes.

Para conversas rápidas, o SKILL.md já lista as 5 inferências mais importantes. Não trazer este arquivo para cada pergunta — vira entrevista burocrática e custa a simpatia do usuário.

## As restrições

### 1. Time

- **Tamanho**: 1, 3, 10, 30, 100+ devs?
- **Perfil**: júnior/pleno/sênior misto? Quantos full-stack vs. especializados?
- **Há SRE / DevOps dedicado?** (sem isso, arquitetura distribuída vira fardo operacional.)
- **Há on-call 24/7?** (sem isso, *blast radius* de falha noturna importa muito.)
- **Pessoas dedicadas ao projeto ou compartilhadas?**

*Como muda a recomendação:*
- Time pequeno sem SRE → monolito modular, sem Kubernetes, sem microserviços, banco gerenciado.
- Time grande com SRE → microserviços e stack diversa viáveis, mas ainda não *default*.
- Time muito júnior → priorizar convenções simples e explícitas, evitar "magia" de framework.

### 2. Quem escreve o código

- **Humanos, IA, ou híbrido?**
- **Qual ferramenta?** Cursor, Copilot, Aider, OpenCode, agente autônomo?
- **Se IA pesa muito:** *Navigation Paradox* vira restrição de primeira ordem. Estrutura flat com features autocontidas é melhor do que Clean Architecture porque o grafo de navegação é menor.

*Como muda a recomendação:*
- IA-heavy → priorizar baixo número de arquivos por feature, nomes explícitos, ausência de indireção desnecessária.
- Humano-heavy tradicional → padrões conhecidos do time ganham pontos mesmo sem serem o menor grafo possível.

### 3. Tráfego e escala

- **Atual**: requisições/minuto, usuários simultâneos, volume de dados.
- **Projetado em 12-24 meses**: ordem de magnitude (10x? 100x? 2x?)
- **Perfil**: leitura pesada, escrita pesada, *burst* (pico diário), *steady-state*?
- **Latência requerida**: p50, p95, p99 por endpoint.

*Como muda a recomendação:*
- <100 req/min → monolito single-instance, qualquer banco SQL serve.
- 100-10k req/min → monolito modular + cache + *read replicas*; começa a importar otimização.
- >10k req/min sustentado → arquitetura por bottleneck específico; extração de serviço justificada para componente quente.
- Latência <50ms p99 dura → restrição séria; afeta banco, ORM, decisões de cache, talvez linguagem.

### 4. Consistência e dados

- **Requisitos de consistência**: forte, eventual, *last write wins*? Por quê?
- **Requisitos transacionais**: há fluxo que *precisa* ser ACID (pagamento, saldo, inventário)?
- **Auditoria**: há requisito de histórico completo de estado? (Se sim, considerar Event Sourcing *naquele contexto específico*, não global.)
- **Tamanho de dados**: GB, TB, PB? Crescimento esperado?
- **Padrão de acesso**: relacional (muitos *joins*), documental (agregados fechados), time-series, grafo?

### 5. Timeline

- **MVP para validar em N semanas?**
- **Produto pensado para 5 anos?**
- **Prazo regulatório** (ex.: precisa estar em produção antes de X lei entrar em vigor)?
- **Quando é o primeiro usuário pagante?**

*Como muda a recomendação:*
- MVP 3 semanas → *simplicity over correctness of design*; dívida técnica aceitável desde que documentada.
- Produto 5 anos → investir em modularidade, bounded contexts, testes estruturais.

### 6. Reversibilidade e tolerância a risco

- **Tolerância a downtime**: % aceitável? Qual o impacto financeiro/reputacional de 1h fora?
- **Tolerância a perda de dados**: zero (banco)? Minutos (mensageria)? Horas (analytics)?
- **Estratégia de *rollback***: tem? Testada?
- **Apetite para migração futura**: time topa refactor grande em 2 anos, ou decisão precisa ser estável por muito tempo?

### 7. Regulatório e segurança

- **LGPD / GDPR** (dados pessoais)?
- **PCI-DSS** (pagamento)?
- **HIPAA** (saúde nos EUA)?
- **SOC 2**, **ISO 27001** (enterprise B2B)?
- **Residência de dados**: precisa ficar em país específico?
- **Auditoria externa**: frequência, tipo, o que precisa ser demonstrável?
- **Criptografia em trânsito e em repouso**: requerida? qual padrão?

*Como muda a recomendação:*
- Regulatório pesado → log estruturado, audit trail, separação de ambientes, IAM granular viram requisitos duros.
- Pagamento → PCI-DSS força que certos dados *não* toquem seu sistema (tokenizar via Stripe/Adyen).

### 8. Capacidade operacional e ferramental

- **Observabilidade em produção**: logs centralizados? métricas? *tracing*? alertas?
- **CI/CD**: existe? quanto tempo de commit até produção?
- **Ambiente de staging**: existe? é fiel ao produção?
- **Feature flags / canary deploys**: possível?
- **Disaster recovery**: existe plano? RTO e RPO conhecidos?

### 9. Contexto de negócio

- **Domínio estável ou em descoberta?** Descoberta → evitar DDD tático; modelo vai mudar.
- **Integração com sistemas legados?** Qual profundidade? (Se sim, ACL é justificável — um dos poucos lugares onde a ACL paga o próprio custo.)
- **Multi-tenant?** Isolamento por schema, por banco, por row?
- **Internacionalização / multi-moeda / multi-fuso**?

### 10. Capacidade cognitiva

- **Quanta complexidade o time topa carregar por feature?**
- **Quanto tempo é aceitável para um dev novo conseguir entregar a primeira feature?**
- **Há documentação viva do sistema ou o conhecimento é oral?**

## Ordem de importância

Quando você só pode perguntar uma coisa, perguntar: **"quem vai manter isso e com qual apetite para complexidade operacional?"** Isso resolve 60% das decisões sobre se algo sofisticado deve ser proposto ou não.

Quando você pode perguntar três: **(1) tamanho do time + se tem SRE, (2) ordem de magnitude de tráfego, (3) timeline**. Essas três cobrem >80% das decisões one-way door.

## O que nunca perguntar

- "Você prefere Clean Architecture ou Hexagonal?" (Pergunta errada — a decisão precede o padrão.)
- "Você quer microserviços?" (Pergunta enviesada — sugere que microserviços são o bom caminho por default.)
- "Vai escalar?" (Sem ordem de magnitude, é inútil.)
- "Qual framework você gosta?" (Preferência pessoal não é restrição — é taste.)
