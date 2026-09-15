import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import { UserRepositoryImpl } from "../../infrastructure/repositories/UserRepositoryImpl";
import { CreateUserUseCase } from "../../application/use-cases/CreateUserUseCase";
import { GetUserUseCase } from "../../application/use-cases/GetUserUseCase";
import { sendWelcomeEmail } from "../../../notifications/sendWelcomeEmail";
import { SesEmailSender } from "../../../notifications/SesEmailSender";

export function registerUserRoutes(app: FastifyInstance, prisma: PrismaClient) {
  const repo = new UserRepositoryImpl(prisma);
  const createUser = new CreateUserUseCase(repo);
  const getUser = new GetUserUseCase(repo);
  const emailSender = new SesEmailSender();

  app.post<{ Body: { name: string; email: string } }>("/users", async (req, reply) => {
    const dto = await createUser.execute(req.body.name, req.body.email);
    await sendWelcomeEmail(emailSender, dto.email, dto.name);
    return reply.code(201).send(dto);
  });

  app.get<{ Params: { id: string } }>("/users/:id", async (req, reply) => {
    const dto = await getUser.execute(req.params.id);
    if (!dto) return reply.code(404).send({ error: "not found" });
    return reply.send(dto);
  });
}
