import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({ timestamps: false })
export class Follow extends Model {
  @Column(DataType.INTEGER)
  source!: number;

  @Column(DataType.INTEGER)
  destination!: number;
}
