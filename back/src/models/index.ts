import dotenv from "dotenv";
import mongo from "mongoose";
import { Sequelize } from "sequelize-typescript";
import { Tag } from "./project/tag.model";
import { Position } from "./project/position.model";

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

export const initModel = async () => {
  const tagModel = await Tag.findAll();
  const positionModel = await Position.findAll();
  if (process.env.TAG_LIST !== undefined && tagModel.length === 0) {
    const tagList = process.env.TAG_LIST.split(';');
    tagList.forEach(async (element) => {
      await Tag.create({
        tagTitle: element
      })
    });
  }
  if (process.env.POSITION_LIST !== undefined && positionModel.length === 0) {
    const positionList = process.env.POSITION_LIST.split(';');
    positionList.forEach(async (element) => {
      await Position.create({
        positionName: element
      })
    });
  }
};