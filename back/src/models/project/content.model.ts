import { Table, Column, Model, DataType, HasMany } from "sequelize-typescript";

@Table
export class Content extends Model {
  @Column(DataType.STRING(200))
  title!: string;

  @Column(DataType.STRING(500))
  content!: string;

  @Column(DataType.STRING(200))
  comments!: string;
}
