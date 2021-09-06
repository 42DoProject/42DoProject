import { Table, Column, Model, DataType, HasMany } from "sequelize-typescript";

@Table
export class User extends Model {
  @Column(DataType.STRING(200))
  username!: string;
}
