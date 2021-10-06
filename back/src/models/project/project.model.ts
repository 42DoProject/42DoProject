import { Table, Column, Model, DataType, HasOne, HasMany, ForeignKey } from "sequelize-typescript";
import { Applyprojectprofile } from "./applyprojectprofile.model";
import { Likeprojectprofile } from "./likeprojectprofile.model";
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

  @Column(DataType.STRING(200))
  unplashLink!: string;

  @Column(DataType.INTEGER)
  totalMember!: number;

  @Column(DataType.INTEGER)
  currentMember!: number;

  @Column(DataType.STRING(20))
  state!: string;

  @Column(DataType.DATE)
  startDate!: Date;

  @Column(DataType.DATE)
  endDate!: Date;

  @Column(DataType.INTEGER)
  like!: number;

  @Column(DataType.INTEGER)
  viewCount!: number;

  @Column(DataType.INTEGER)
  commentCount!: number;

  @Column(DataType.JSON)
  skill!: Number[];

  @Column(DataType.JSON)
  position!: Number[];

  @ForeignKey(() => Content)
  @Column
  contentId!: number

  @HasOne(() => Content)
  content!: Content;

  @HasMany(() => Projectprofile)
  projectprofile!: Projectprofile[];

  @HasMany(() => Applyprojectprofile)
  applyprojectprofile!: Applyprojectprofile[];

  @HasMany(() => Likeprojectprofile)
  likeprojectprofile!: Likeprojectprofile[];
}