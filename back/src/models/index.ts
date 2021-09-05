import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
import { User } from "./user.model";

dotenv.config();

export const sequelize: Sequelize = new Sequelize({
  dialect: "mysql",
  database: process.env.MYSQL_DATABASE,
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  models: [__dirname + "/**/*.model.ts"],
  modelMatch: (filename, member) => {
    return (
      filename.substring(0, filename.indexOf(".model")) === member.toLowerCase()
    );
  },
});

sequelize.addModels([User]);
