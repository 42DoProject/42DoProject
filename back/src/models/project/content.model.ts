import { Table, Column, AllowNull, Model, DataType, HasMany } from "sequelize-typescript";

@Table
export class Content extends Model {
  @Column(DataType.STRING(200))
  title!: string;

  @Column(DataType.TEXT)
  content!: string;

  // @AllowNull
  // @Column(DataType.ENUM('null'))
  // comments!: string[];
}
