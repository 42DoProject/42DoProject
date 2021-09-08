import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({ timestamps: false })
export class BlackList extends Model {
  @Column(DataType.STRING(200))
  token!: string;

  @Column(DataType.INTEGER)
  expiryDate!: number;
}
