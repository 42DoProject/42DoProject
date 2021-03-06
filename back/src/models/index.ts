import dotenv from "dotenv";
import mongo from "mongoose";
import { Sequelize } from "sequelize-typescript";

dotenv.config();

export const sequelize: Sequelize = new Sequelize({
  dialect: "mysql",
  host: process.env.MYSQL_HOST,
  database: process.env.MYSQL_DATABASE,
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  models: [__dirname + "/**/*.model.js"],
  modelMatch: (filename, member) => {
    return (
      filename.substring(0, filename.indexOf(".model")) === member.toLowerCase()
    );
  },
});

export const mongoose = async () => {
  const db = mongo.connection;
  db.once("open", () => {
    console.log("[MongoDB] connected");
  });
  await mongo.connect(
    `mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}:27017`
  );
};