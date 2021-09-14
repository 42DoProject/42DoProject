import { Table, Column, HasMany, Model, DataType, ForeignKey } from "sequelize-typescript";
import { Projecttag } from "./projecttag.model";

@Table
export class Tag extends Model {
  @Column(DataType.STRING(20))
  tagTitle!: string;

  @HasMany(() => Projecttag)
  projecttag!: Projecttag[];
}