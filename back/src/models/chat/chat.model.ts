import {
  Model,
  Table,
  Column,
  DataType,
  PrimaryKey,
} from "sequelize-typescript";

@Table
export class Chat extends Model {
  @PrimaryKey
  @Column(DataType.STRING)
  id!: string;

  @Column(DataType.JSON)
  users!: number[];
}
