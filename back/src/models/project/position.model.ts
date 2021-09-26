import { Table, Column, HasMany, Model, DataType } from "sequelize-typescript";
import { Projectposition } from "./projectposition.model";

@Table
export class Position extends Model {
  @Column(DataType.STRING(20))
  positionName!: string;

  @HasMany(() => Projectposition)
  projectposition!: Projectposition[];
}