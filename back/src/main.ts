import express from "express";
import dotenv from "dotenv";
import { sequelize } from "./models";
import routes from "./routes";

dotenv.config();

async function bootstrap() {
  await sequelize.sync();
  const app: express.Application = express();

  app.use(express.json());
  app.use(routes);

  await app.listen(process.env.PORT);
  console.log(`Server running on http://localhost:${process.env.PORT}`);
}

bootstrap();
