# Anti-padrões arquiteturais — tabela de detecção

Use este arquivo em code review, em análise brownfield, e quando estiver prestes a propor uma camada/interface/padrão (para checar se não está recomendando um anti-padrão).

Para cada item: **sinal no código** → **passo da Regra dos 3 Passos que falha** (passos 1-3 do §5 do SKILL.md — não confundir com os princípios P1-P7 do §7) → **simplificação recomendada**.

## Tabela principal

| Anti-padrão | Sinal | Regra dos 3 Passos — onde falha | Simplificação |
|---|---|---|---|
| Interface com 1 implementação e sem mock | `IUserService` → `UserService` único, sem teste que precisa de mock | passo 1: só há uma implementação real, identificada por nome | Remover interface, usar struct/classe concreta |
| Mapper DTO↔Domain 1:1 | `UserDTO` tem os mesmos campos de `User` | passo 3: adiciona complexidade sem esconder nada | Usar `User` direto na fronteira, ou serialização automática do framework |
| Use Case *one-liner* | `CreateOrderUseCase.execute()` é uma chamada a `orderRepository.save()` | passo 3: adiciona camada sem proteger invariante | *Inlinar* no handler / controller |
| Repository Pattern sobre ORM já capaz | `UserRepository` escondendo Prisma / EF / ActiveRecord / SQLAlchemy | passo 1 + passo 3: ORM já é a abstração; repositório adiciona sem esconder | Usar ORM diretamente, encapsulado no pacote do contexto |
| Domain Service sem invariante | `OrderCalculationService` sem estado, sem regra protegida | passo 3: podia ser função pura | Função pura no pacote de domínio |
| Aggregate sem invariante | `OrderAggregate` = `Order { items, total }` sem regra de consistência | passo 3: nome sofisticado sobre struct trivial | `struct` / classe simples |
| Abstração "para trocar de banco" | `IDatabaseProvider` sem plano real de troca | passo 1: só há uma implementação; passo 2: troca especulativa | Remover abstração, assumir banco escolhido; encapsular no pacote |
| Event Sourcing em CRUD | Eventos capturando criações/edições triviais | Nenhum dos 3: sem requisito de auditoria ou reprodução de estado | DB tradicional + tabela de audit log |
| CQRS sem diferença de modelo | Command e Query compartilham mesmo modelo de leitura/escrita | passo 3: adiciona separação sem separação real | Um modelo único |
| Microserviços sem dor de monolito | 5 serviços em time de 3 pessoas | passo 1 + passo 2: sem pressão real de escala/autonomia | Consolidar em monolito modular |
| Hexagonal em API REST simples | Ports/Adapters sobre CRUD básico | passo 3: todas as portas têm 1 adapter só | Handler → repository local, no mesmo pacote |
| Interface "para testabilidade" sem teste que a use | `IEmailSender` criada para "permitir mock" mas não há teste que mocke | passo 1: implementação única; passo 2: teste de integração resolve | Remover interface; usar teste de integração ou fake local |
| Value Object para tudo | `Email`, `PhoneNumber`, `UserId`, `OrderId`, `Money` todos como VO sem invariante | passo 3: ruído sem proteção real | VO só onde há validação/normalização não-trivial |
| Factory para construção trivial | `UserFactory.create(name, email)` retorna `new User(name, email)` | passo 3: adiciona sem esconder | Construtor direto |
| Anti-corruption Layer sobre API nossa | ACL entre dois módulos que compartilham modelo | passo 1: sem sistema externo; passo 3: adiciona tradução sem divergência real | Chamada direta entre módulos |

## Como apresentar a detecção ao usuário

Para cada anti-padrão detectado, explicitar:

1. **Por que foi detectado** — evidência concreta no código (arquivo, classe, método). Sem isso, vira palpite.
2. **Qual Regra dos 3 Passos falha** — passo 1 (implementação única), passo 2 (custo de troca sem abstração não é maior), passo 3 (adiciona em vez de esconder), ou combinação.
3. **Alternativa recomendada** — concreta, não genérica. "Remover a interface `IUserService` e usar `UserService` diretamente" é útil; "simplificar a camada" não é.
4. **Custo estimado da simplificação** — baixo (rename + inline), médio (remoção de arquivo + ajuste de chamadas), alto (mudança afeta múltiplos pontos).

## Falsos positivos — quando o anti-padrão é legítimo

Nem todo `IUserRepository` é anti-padrão. Mantém quando:

- Existem **de fato** 2+ implementações reais em uso agora (ex.: `InMemoryUserRepository` para testes de integração + `PostgresUserRepository` em produção — mas só se os testes realmente usam o in-memory).
- Há um **plano concreto, com data, nome de responsável e justificativa** de trocar a implementação em <6 meses.
- A interface é **fronteira de contexto** (módulo A define contrato, módulo B implementa como ACL) — aí o papel dela não é polimorfismo, é proteção de bounded context.

## Sinais de código que merecem mais escrutínio

Não são anti-padrões sozinhos, mas somados viram sinal de *abstraction bloat*:

- Pastas chamadas `application/`, `domain/`, `infrastructure/`, `interfaces/` em projeto de <5 kloc.
- Arquivos terminando em `Impl`, `Adapter`, `Port`, `Gateway`, `Manager`, `Handler`, `Service`, `UseCase` em profusão no mesmo módulo.
- Arquivos de <20 linhas que fazem *delegation* para outro arquivo de <20 linhas.
- Estruturas de pasta paralelas que se espelham por tipo de objeto (`entities/` + `dtos/` + `mappers/` + `repositories/` + `services/` + `use_cases/` todos com um arquivo por conceito de negócio).
- Mais arquivos do que features no projeto.

Quando vários desses aparecem juntos, o projeto tem *abstraction illusion* — reorganizar por feature autocontida costuma ser *quick win*.
