import { Table, Column, BelongsTo, Model, DataType, HasMany, ForeignKey } from "sequelize-typescript";
import { Project } from "./project.model";
import { Comments } from "./comments.model";

@Table
export class Content extends Model {
  @Column(DataType.TEXT)
  content!: string;

  @Column(DataType.INTEGER)
  viewCount!: number;

  @ForeignKey(() => Project)
  @Column
  projectId!: number

  @BelongsTo(() => Project)
  project!: Project;

  @HasMany(() => Comments)
  comments!: Comments[];
}
