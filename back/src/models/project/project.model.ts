import { Table, Column, Model, DataType, HasOne, HasMany, ForeignKey } from "sequelize-typescript";
import { Projecttag } from "./projecttag.model";
import { Projectposition } from "./projectposition.model";
import { Projectprofile } from "./projectprofile.model";
import { Content } from "./content.model";

@Table
export class Project extends Model {
  @Column(DataType.STRING(200))
  title!: string;

  @Column(DataType.STRING(200))
  fileName!: string;

  @Column(DataType.STRING(200))
  filePath!: string;

  @Column(DataType.INTEGER)
  totalMember!: number;

  @Column(DataType.INTEGER)
  currentMember!: number;

  @Column(DataType.STRING(20))
  state!: string;

  @Column(DataType.STRING(30))
  period!: string;

  @Column(DataType.INTEGER)
  like!: number;

  @ForeignKey(() => Content)
  @Column
  contentId!: number

  @HasOne(() => Content)
  content!: Content;

  @HasMany(() => Projecttag)
  projecttag!: Projecttag[];

  @HasMany(() => Projectposition)
  projectposition!: Projectposition[];

  @HasMany(() => Projectprofile)
  projectprofile!: Projectprofile[];
}