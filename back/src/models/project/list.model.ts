import { Table, Column, AllowNull, Model, DataType, HasMany } from "sequelize-typescript";

@Table
export class List extends Model {
  @Column(DataType.STRING(200))
  title!: string;

  @Column(DataType.INTEGER)
  totalMember!: number;

  @Column(DataType.INTEGER)
  curMember!: number;

  @Column(DataType.BOOLEAN)
  recruit!: number;

  @Column(DataType.INTEGER)
  heart!: number;

  // @AllowNull
  // @Column(DataType.ENUM('null'))
  // tag!: string[];
}
