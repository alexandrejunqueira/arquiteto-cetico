# users-service

Serviço interno de cadastro de usuários e envio de e-mail de boas-vindas.

- Stack: Node.js 20, TypeScript, Fastify, Prisma (Postgres).
- Time: 2 devs full-stack, sem SRE.
- Tráfego: ~40 req/min em horário comercial.
- Herdado de um consultor que estruturou em Clean Architecture em 2024.

## Estrutura

```
src/
  users/
    domain/
      entities/User.ts
      value-objects/Email.ts
      value-objects/UserId.ts
      repositories/IUserRepository.ts
      factories/UserFactory.ts
    application/
      dtos/UserDTO.ts
      mappers/UserMapper.ts
      use-cases/CreateUserUseCase.ts
      use-cases/GetUserUseCase.ts
    infrastructure/
      repositories/UserRepositoryImpl.ts
    presentation/
      controllers/UserController.ts
  notifications/
    IEmailSender.ts
    SesEmailSender.ts
    sendWelcomeEmail.ts
    __tests__/
      FakeEmailSender.ts
      sendWelcomeEmail.test.ts
```

Não há testes na pasta `users/`. Os únicos testes do projeto estão em `notifications/__tests__/`.
