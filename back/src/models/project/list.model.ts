import { Table, Column, Model, DataType, HasMany } from "sequelize-typescript";

@Table
export class List extends Model {
  @Column(DataType.STRING(200))
  title!: string;

  @Column(DataType.INTEGER())
  totalMember!: number;

  @Column(DataType.INTEGER())
  curMember!: number;

  @Column(DataType.INTEGER())
  recruit!: number;

  @Column(DataType.INTEGER())
  heart!: number;

  @Column(DataType.STRING(200))
  tag!: string;
}
