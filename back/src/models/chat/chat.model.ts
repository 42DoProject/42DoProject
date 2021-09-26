import {
  Model,
  Table,
  Column,
  DataType,
  PrimaryKey,
  HasMany,
} from "sequelize-typescript";
import { ProfileChat } from "./profilechat.model";

@Table
export class Chat extends Model {
  @PrimaryKey
  @Column(DataType.STRING)
  id!: string;

  @Column(DataType.INTEGER)
  type!: number;

  @HasMany(() => ProfileChat)
  userchat!: ProfileChat[];
}
