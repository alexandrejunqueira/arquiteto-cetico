# Posicionamento sobre debates comuns

Este arquivo tem as respostas do agente para perguntas diretas que aparecem o tempo todo. Use quando o usuário fizer uma dessas perguntas — **mas adapte ao contexto específico** dele. Nunca copie a resposta canônica sem checar se as restrições do usuário confirmam a recomendação geral.

## "Clean Architecture sempre?"

**Não.** Clean Architecture é uma ferramenta de um conjunto maior, não o conjunto inteiro.

Apropriada quando **todas** as três se aplicam:

- O domínio tem regras complexas e estáveis que precisam ser protegidas de frameworks voláteis.
- O time é grande o suficiente para pagar o custo cognitivo contínuo (>8 devs trabalhando no mesmo código-base por vários anos).
- Existe requisito **real** de troca de tecnologia de borda (não "um dia talvez").

Em CRUD de porte pequeno/médio — que é a vasta maioria dos projetos — Clean Architecture é *abstraction illusion*. O custo é pago todo dia; o benefício (proteção contra mudança de framework) nunca é cobrado porque a mudança nunca acontece, ou quando acontece a abstração especulativa não se encaixa.

**Alternativa recomendada**: features autocontidas em diretórios, DDD estratégico (Bounded Context + Ubiquitous Language) sem DDD tático por default, encapsulamento de banco/ORM no pacote de cada contexto.

## "Devo usar Repository Pattern sobre ORM?"

**Raramente.**

ORMs modernos (Prisma, EF Core, TypeORM, SQLAlchemy, ActiveRecord, Ecto) **já são uma abstração sobre SQL**. Repository Pattern sobre eles geralmente produz uma segunda camada que reimplementa — mal — paginação, filtros, relações, lazy loading.

A justificativa clássica é "para poder trocar de banco depois". Mas:

- Trocar de banco acontece raramente.
- Quando acontece, a abstração especulativa raramente se encaixa na nova realidade (um banco documental tem padrões de acesso fundamentalmente diferentes de um relacional).
- A troca vai ser dolorida com ou sem Repository Pattern.
- O custo cognitivo de manter a camada é pago todo dia, não só no dia da troca.

**Alternativa recomendada**: use o ORM diretamente, **encapsulado no pacote** do contexto — ou seja, nenhum outro contexto importa o ORM diretamente; todos passam por funções exportadas do pacote. Isso dá o baixo acoplamento que você queria sem a interface adicional.

**Quando Repository faz sentido**: quando você **de fato** tem duas implementações em uso hoje (ex.: Postgres para produção + InMemory para um teste de integração que realmente roda no CI). Ou quando o "repositório" não é mapeamento de tabela, é fachada para um domínio complexo com lógica agregada (invariantes, cálculos, validações cross-table).

## "Microserviços ou monolito?"

**Default: monolito modular.**

Extrair serviços quando — e **somente** quando — **uma** das condições é verdadeira:

- Um módulo específico tem requisito de escala ou disponibilidade fundamentalmente diferente do resto (ex.: serviço de *image processing* que precisa de GPU; serviço de *real-time chat* que precisa de *persistent connections*).
- Um módulo específico precisa de *stack* tecnológico diferente por razão técnica real (ex.: ML Python + aplicação principal em TypeScript; processamento de áudio em Rust + API em Go).
- Times separados precisam de autonomia de *deploy*, e o custo de coordenação de *deploys* no monolito já é medível e doloroso.

**Nunca** "microserviços porque é moderno", "microserviços porque vamos escalar um dia", "microserviços porque é melhor para manter separado".

**Custo do microserviço que as pessoas esquecem**: consistência distribuída, *distributed tracing*, versionamento de API interna, falhas parciais, complexidade de teste ponta a ponta, duplicação de modelo, onboarding mais lento.

**Caminho recomendado**: começar como monolito modular bem cortado (bounded contexts respeitados, módulos não importam internals uns dos outros). Quando a dor específica aparecer em um módulo específico, extrair *aquele* — não todos.

## "Event Sourcing / CQRS?"

**Só em contextos específicos dentro do sistema** — nunca como padrão do sistema inteiro.

Justifica-se quando **uma** é verdade:

- Há requisito **real** de auditoria completa do histórico de estado (financeiro, saúde, compliance) — e você precisa reconstruir "o que o sistema pensava em tal data".
- Os modelos de leitura e escrita divergem tanto que unificá-los machuca mais do que separá-los (ex.: escrita transacional em um modelo normalizado + leitura em um modelo denormalizado tipo search index ou materialized view).

**Não justifica**:

- "Para poder fazer *time travel* um dia".
- "Porque permite reprocessar eventos".
- "Porque fica mais escalável".
- Em CRUD comum, Event Sourcing é complexidade monumental em troca de nada útil.

**Alternativa para auditoria simples**: banco tradicional + tabela de *audit log* (quem alterou, quando, o que mudou). 95% dos casos "precisamos de auditoria" são resolvidos por isso.

**CQRS sem Event Sourcing**: se o modelo de leitura precisa ser diferente do de escrita (ex.: dashboard agregando muitas tabelas), OK separar *view models*. Isso não é CQRS pesado — é só ter *query objects* separados dos *command handlers*. O nome pomposo não precisa ser usado.

## "TDD sempre?"

**Teste automatizado sempre; TDD estrito nem sempre.**

TDD funciona melhor em:

- Regras de negócio com comportamento **bem definido** de antemão (cálculo de frete, validação de cupom, regras de desconto).
- Código puro, sem dependência forte de I/O.
- Refactor guiado por testes existentes.

TDD funciona pior em:

- UI exploratória, onde o comportamento está sendo descoberto no próprio ato de construir.
- Integrações com sistemas externos que você ainda não entende — você precisa de um *spike* para entender o comportamento real antes de conseguir escrever teste.
- Protótipos que vão ser jogados fora.

**Recomendação**: *testes primeiro* onde o comportamento é claro; *testes depois de spike* onde o comportamento está sendo descoberto. A discussão "TDD sim ou TDD não" é desfocada — a pergunta real é "qual o ponto certo de começar a escrever testes neste caso específico".

## "Código vindo de IA pode pular arquitetura?"

**Não. A arquitetura importa *mais* em times que usam IA, não menos.**

Duas razões empíricas (DORA 2025 + Faros AI 2025 + *Navigation Paradox* 2026 — números e fontes nas seções 1 e 2 de `references/fundamentacao.md`):

1. **A IA amplifica o que o time já faz** (tese do DORA). Times com boa disciplina arquitetural produzem software melhor e mais rápido com IA. Times sem disciplina acumulam dívida técnica **mais rápido** com IA — porque a IA gera mais código, e se a organização é ruim, o código ruim também aumenta em volume. A telemetria da Faros AI mostra PRs muito maiores e revisão muito mais lenta em times de alta adoção. Sem arquitetura, o gargalo vai para revisão.

2. **O *Navigation Paradox* mostra que código mal organizado confunde agentes de IA em tarefas não-triviais**. Em tarefas com dependência arquitetural sem overlap lexical (mudanças de interface, refactor que afeta vários módulos), o agente falha em uma fração grande dos casos sem navegação de grafo — e, na maioria das vezes em que a ferramenta de navegação existe, ele nem a usa, porque não "sente" a dificuldade.

**Implicação prática**: boa arquitetura é, hoje, também *acessibilidade para IA*. Features autocontidas em diretórios irmãos, com nomes explícitos e poucas camadas, reduzem o grafo que o agente precisa navegar — e aumentam a probabilidade de ele mudar a coisa certa.

## "Devo criar uma interface aqui para facilitar testes?"

**Só se você vai escrever o teste que mocka a interface agora. Se não vai, não cria.**

Criar `IUserService` "para permitir mock" sem nenhum teste que de fato mocke é um anti-padrão comum. A interface fica lá, permanentemente, sendo lida por todo dev e todo agente de IA que entra no arquivo, sem pagar o próprio custo.

**Alternativas comuns**:

- **Teste de integração** com banco de teste (Postgres em Docker, SQLite em memória): sem mock, sem interface, comportamento real.
- **Fake local**: uma implementação de teste que não tenta ser genérica — vive ao lado dos testes, não no código de produção.
- **Test containers / fixtures**: mais fiel, sem abstração adicional.

**Quando interface pra teste vale a pena**: dependência externa cara (API paga, serviço com rate limit, integração com sistema legado instável) e você vai escrever o teste de verdade agora.

## "Devo separar este módulo em dois serviços?"

Aplicar as 10 Perguntas (`references/10-perguntas.md`). Se não tiver:

- Dor medida no módulo atual (latência, blast radius, acoplamento de deploy), ou
- Escala divergente entre as duas metades, ou
- Time separado que precisa de autonomia de deploy,

**Não separar.** Quando a hora chegar, você vai saber — a dor vai estar documentada em incidentes ou em métricas de SLO.
