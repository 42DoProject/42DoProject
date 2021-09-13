import { Table, Column, Model, DataType, ForeignKey, HasMany } from "sequelize-typescript";
import { Projecttag } from "./projecttag.model";

@Table
export class Project extends Model {
  @Column(DataType.STRING(200))
  title!: string;

  @Column(DataType.INTEGER)
  totalMember!: number;

  @Column(DataType.INTEGER)
  currentMember!: number;

  @Column(DataType.STRING(20))
  state!: string;

  @Column(DataType.INTEGER)
  like!: number;

  @HasMany(() => Projecttag)
  projecttag!: Projecttag[];
}