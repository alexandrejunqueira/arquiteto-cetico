# Fundamentação empírica

Este arquivo tem as evidências que sustentam os princípios da skill. Use quando o usuário:

- Pedir justificativa externa para uma recomendação.
- Desafiar o agente com "mas [autoridade] recomenda X" — aqui tem contra-argumentos com dados.
- Quiser aprofundar o "porquê" de um princípio.

Cada seção tem: **fonte** → **achado central** → **implicação para o agente**.

## 1. A IA é enviesada para o complexo (*abstraction bloat*)

**Fonte**: Addy Osmani, *"The 80% Problem in Agentic Coding"*, Elevate/Substack, janeiro 2026. Análise de 5.000 desenvolvedores + dados DORA/Faros/Atlassian.

**Achado central**: quando deixado sem restrição, o agente de IA:

- Escalona 1.000 linhas onde 100 bastariam, criando hierarquias de classe elaboradas onde uma função resolveria.
- Otimiza para **parecer abrangente**, não para manutenibilidade.
- Propaga suposições incorretas (*assumption propagation*): entende mal algo cedo, constrói a feature inteira sobre premissa falha.
- Apresenta **concordância sicofântica** — não empurra de volta, não questiona, não apresenta trade-offs.

**Dados quantitativos (Faros AI, *The AI Productivity Paradox*, 2025 — telemetria de ~10.000 devs)**:

- Times de alta adoção de IA fazem *merge* de **98% mais PRs**.
- Mesmo time vê tempo de *code review* **aumentar 91%**.
- Tamanho médio de PR sobe **154%**.
- *Code review* tornou-se o novo gargalo.

**Achado complementar (DORA, *2025 State of AI-assisted Software Development*)**: IA funciona como **amplificador** — times com boas práticas (plataforma interna, testes, fluxo de trabalho pequeno) melhoram com IA; times sem essas práticas pioram. O DORA **não** é a fonte dos percentuais acima — não misturar as atribuições ao citar.

> Estes números são a **única** cópia na skill. Outros arquivos (`debates.md`) referenciam esta seção em vez de repetir os valores, para que uma correção aqui não deixe cópias desatualizadas.

**Implicação para o agente**: a resposta default nunca é mais código, mais camadas, mais interfaces. A resposta default é **menos**, com justificativa explícita quando "mais" for necessário. O agente é explicitamente treinado a empurrar de volta — é o contrário do padrão sicofântico documentado.

## 2. *Navigation Paradox* — custo real da abstração para agentes

**Fonte**: Tarakanath Paipuru, *"The Navigation Paradox in Large-Context Agentic Coding: Graph-Structured Dependency Navigation Outperforms Retrieval in Architecture-Heavy Tasks"*, arXiv:2602.20048, fevereiro 2026. 258 trials com Claude Sonnet 4.5 sobre codebase FastAPI.

**Tabela de resultados**:

| Tarefa | Vanilla | Com Graph (MCP) | Delta |
|---|---|---|---|
| G1 (semântica) | 90% ACS | 88,9% ACS | ≈0 |
| G2 (estrutural — imports) | 79,7% ACS | 76,4% ACS | **-3pp** (regressão) |
| G3 (oculta — arquitetural sem overlap lexical) | 76,2% ACS | **99,4% ACS** | **+23,2pp** |

> Assim como na seção 1, esta tabela é a única cópia dos números do estudo. `SKILL.md` e `debates.md` descrevem o mecanismo sem repetir percentuais.

**Descobertas críticas**:

1. Quando há ferramenta de navegação de grafo disponível, o agente **a ignora em 58% das vezes**. Em tarefas G2, **zero** em 30 trials usou a ferramenta — mesmo sendo exatamente a situação para a qual ela foi desenhada.
2. Quando o agente usa a ferramenta, ACS sobe para 99,5%. Quando ignora, fica em 80,2% — idêntico ao baseline.
3. Modelos invocam ferramentas apenas quando **"sentem" dificuldade**. Em arquiteturas com muitas camadas, a falsa sensação de "já entendi" é constante — o agente não sente a dificuldade.
4. **Janelas de contexto maiores NÃO resolvem**. O arquivo pode estar no contexto e mesmo assim não receber atenção.
5. BM25 (retrieval) domina tarefas semânticas mas dá **zero benefício** para dependências arquiteturais. Dependências estruturais precisam de **navegação**, não de **busca**.

**Implicação para o agente**: cada camada de abstração adicionada (use case → mapper → repository interface → entity → domain service) **aumenta o grafo de navegação** que um futuro agente de IA precisará percorrer. Esse grafo tem custo medível. Uma arquitetura "tecnicamente correta" com Clean Architecture pode ser **pior** para coding agents do que uma arquitetura flat bem nomeada. Quando o usuário confirma que código é escrito por IA ou por híbrido, custo de navegação para IA vira restrição de primeira ordem.

## 3. YAGNI voltou com força

**Fontes**:

- Kent Beck, *Extreme Programming Explained* (origem do YAGNI + "Simple Design").
- Martin Fowler, *"Yagni"* em martinfowler.com/bliki/Yagni.html.
- Derek Comartin, CodeOpinion.
- Kohavi et al. (Microsoft Research, estudo sobre eficácia de features planejadas).

**Princípio**: capacidades especulativas construídas antecipadamente têm **quatro custos**:

1. **Custo de construção** — dev gasta tempo agora construindo coisa que ninguém pediu.
2. **Custo de atraso** — features reais que deixaram de sair porque o dev estava construindo a especulativa.
3. **Custo de carregamento** — o código especulativo precisa ser entendido e mantido **mesmo sem ser usado**. Vira ruído no grafo de navegação.
4. **Custo de reparo** — quando a necessidade real surge, a abstração especulativa raramente se encaixa; remover uma abstração errada é mais caro do que introduzir uma certa.

**Estudo Kohavi (Microsoft)**: mesmo com análise *up-front* cuidadosa, **apenas 1/3 das features planejadas realmente melhoraram as métricas** para as quais foram desenhadas. Ou seja, especulação de *produto* falha em 2/3 dos casos. Especulação de *arquitetura* não é mais sofisticada que especulação de produto — provavelmente falha em taxa parecida.

**Implicação para o agente**: a pergunta default diante de qualquer abstração proposta é: *"esta abstração resolve um problema que o usuário já tem e mediu, ou um problema hipotético?"* Se hipotético, recusar com justificativa.

## 4. DDD estratégico vs. DDD tático

**Fonte**: Eric Evans, *Domain-Driven Design: Tackling Complexity in the Heart of Software* (2003).

**Achado central**: DDD tem duas metades.

- **Estratégico**: Bounded Context, Context Map, Ubiquitous Language, Context Mapping Patterns (Partnership, Customer/Supplier, Conformist, ACL, etc.).
- **Tático**: Entity, Value Object, Aggregate, Repository, Domain Service, Factory, Domain Event.

**Observação empírica (2026)**: o DDD tático é uma das áreas onde o *abstraction bloat* da IA mais se manifesta — o LLM gera quatro camadas onde uma bastava, porque DDD tático tem presença massiva no dataset de treino (muitos blog posts, muitos tutoriais).

**Mas o DDD estratégico ficou *mais* importante com IA, não menos**:

- **Bounded Contexts** funcionam como fronteiras semânticas que impedem a IA de "sangrar" conceitos de um contexto para outro — o agente não confunde `Order` no contexto de Billing com `Order` no contexto de Shipping se as fronteiras estão explícitas e materializadas em código (módulos separados).
- **Linguagem Ubíqua** é a melhor ferramenta de redução de ambiguidade para prompts e specs. Agentes de IA se perdem muito mais em vocabulário vago do que em arquitetura complexa.
- **Context Mapping** ajuda o agente a entender qual contexto pode confiar em qual, evitando que uma mudança em um módulo "cascate" silenciosamente para outro.

**Implicação para o agente**: ao desenhar ou revisar arquitetura, investir tempo em Context Map + Ubiquitous Language + Bounded Context + integrações **antes** de qualquer decisão tática. O tático vira exceção, não default.

## 5. Encapsulamento ≠ Dependency Inversion

**Fonte**: Jarrod Roberson, *"Go is Not Java"*, Programming Missives. Síntese de múltiplas reflexões sobre transplante acrítico de padrões GoF entre linguagens.

**Erro conceitual comum**: tratar **DI (inversão de dependência via interface)** como a **única** forma de ter baixo acoplamento.

- **Encapsulamento** = esconder estado e implementação atrás de uma fronteira (pacote, módulo, namespace). Conseguido em:
  - Go: identificadores em minúscula (`package-private`).
  - Rust: `pub(crate)`.
  - Python: convenção `_` e `__all__`.
  - Java: `package-private`.
  - TypeScript: `barrel files` e `export` seletivo.
- **Dependency Inversion** = depender de abstração, não de implementação. Forma concreta: injetar uma interface em vez de uma classe.

**Relação**: DI é *uma* forma de conseguir baixo acoplamento quando você precisa de **polimorfismo em runtime** ou **substituibilidade para testes**. Encapsulamento é *outra* forma, muitas vezes suficiente, quando você só precisa de uma fronteira estável com implementação fixa.

**Observação de Roberson (Go)**: padrões Gang-of-Four são frequentemente "implementações terríveis portadas de Java que ignoram as idiossincrasias da linguagem hospedeira". Singleton com `sync.Once()` em Go é diferente de Singleton com `private static` em Java — e copiar um por analogia quebra o que o autor original estava tentando conseguir.

**Implicação para o agente**: antes de recomendar `interface ProductRepository` injetada em `ProductService`, perguntar: *"existe mais de uma implementação real hoje, ou existe um teste que precisa de mock?"* Se não, um struct exportado chamando um repository não-exportado **dentro do mesmo pacote** já produz baixo acoplamento — sem criar um nó a mais no grafo de navegação.

## 6. Reversibilidade como critério de risco

**Fonte**: Johannes Millan, *"AI and Software Architecture: A Dangerous Convenience"*, Super Productivity, fevereiro 2026 — citando o princípio *one-way door / two-way door* da Amazon.

**Princípio**:

- **Two-way doors** (reversíveis): escolha de biblioteca, estrutura de pastas, convenção de nomenclatura, ORM específico, formato de log. **Decidir rápido, mudar depois se necessário.**
- **One-way doors** (irreversíveis): tecnologia de banco (relacional ↔ documento), fronteiras de serviço (monolito → microserviços), modelo de dados principal, padrão de comunicação (síncrono ↔ assíncrono), protocolo público de API. **Investir tempo humano significativo. Pedir confirmação explícita antes de decidir.**

**Implicação para o agente**: para decisões de alto impacto e baixa reversibilidade, **sempre apresentar pelo menos 2 alternativas** com trade-offs antes de recomendar. Para decisões two-way door, decidir e seguir.

## 7. *Abstraction illusion*

**Fonte**: Johannes Millan, mesmo artigo.

Citação que o agente pode usar verbatim quando for relevante (respeitando limite):

> *"AI democratized access to sophisticated architectural patterns. That's genuinely valuable — developers can now explore approaches they wouldn't have encountered otherwise. But access without judgment leads to overengineering: systems that are architecturally impressive and practically unmaintainable."*

**Princípio**: a IA **democratizou acesso** a padrões sofisticados. Isso é genuinamente valioso — devs hoje exploram abordagens que não encontrariam antes. Mas **acesso sem julgamento** leva a *overengineering*: sistemas arquiteturalmente impressionantes e praticamente não-manuteníveis.

O papel deste agente é **fornecer o julgamento** que a IA genérica não fornece: aplicar o padrão ao contexto, recusar o que não cabe.

## 8. Workflow do Advogado do Diabo

**Fonte**: Johannes Millan, mesmo artigo.

**Uso recomendado de IA** (inclusive desta skill):

1. **Formar sua opinião arquitetural primeiro**, baseada nas restrições.
2. **Pedir à IA para argumentar contra**: *"quais são os riscos e downsides de usar X para este caso de uso?"*
3. **Avaliar os contra-argumentos** — aplicam-se ao seu contexto específico? Se sim, repensar. Se não, avançar com mais confiança.
4. **Pedir à IA o que você pode ter esquecido**: *"que modos de falha não-óbvios devo considerar?"*

**Implicação para o agente**: quando o usuário pedir "me dá uma arquitetura", a skill resiste — converte o pedido em discovery de restrições e estratégico antes de desenhar. Quando a skill dá uma recomendação, roda mentalmente a crítica sobre a própria recomendação e apresenta a crítica junto.

## 9. Referências originais para citação

Quando o usuário pedir a fonte:

1. **Waldemar Neto** — *"A IA NÃO ENTENDE SUA ARQUITETURA (e isso sai caro 💸)"* (Dev Lab, abril 2026). Vídeo-base desta skill.
2. **Addy Osmani** — *"The 80% Problem in Agentic Coding"* (Elevate/Substack, janeiro 2026).
3. **Tarakanath Paipuru** — *"The Navigation Paradox in Large-Context Agentic Coding"* (arXiv:2602.20048, fevereiro 2026).
4. **Johannes Millan** — *"AI and Software Architecture: A Dangerous Convenience"* (Super Productivity, fevereiro 2026).
5. **Jarrod Roberson** — *"Go is Not Java"* (Programming Missives).
6. **Martin Fowler** — *"Yagni"* (martinfowler.com/bliki/Yagni.html).
7. **Eric Evans** — *Domain-Driven Design: Tackling Complexity in the Heart of Software* (2003).
8. **Robert C. Martin** — *Clean Architecture*. Referência de como o agente **NÃO** usa Clean Architecture por default.
9. **Faros AI** — *The AI Productivity Paradox Report* (2025). Fonte dos números de PRs, tempo de review e tamanho de PR.
10. **Google/DORA** — *2025 State of AI-assisted Software Development*. Fonte da tese "IA é amplificador".
11. **Michael Nygard** — *"Documenting Architecture Decisions"*. Formato ADR.
12. **Kent Beck** — *Extreme Programming Explained*. Origem do YAGNI e "Simple Design".
