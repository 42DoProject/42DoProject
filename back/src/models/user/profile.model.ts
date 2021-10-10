import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from "sequelize-typescript";
import { ProfileChat } from "../chat/profilechat.model";
import { User } from "./user.model";
import { Comments } from "../project/comments.model";
import { Applyprojectprofile } from "../project/applyprojectprofile.model";
import { Likeprojectprofile } from "../project/likeprojectprofile.model";
import { Projectprofile } from "../project/projectprofile.model";

@Table({ timestamps: false })
export class Profile extends Model {
  @Column(DataType.FLOAT)
  level!: number;

  @Column(DataType.STRING(20))
  lastAccess!: string;

  @Column(DataType.INTEGER)
  status!: number;

  @Column(DataType.INTEGER)
  position!: number;

  @Column(DataType.JSON)
  skill!: number[];

  @Column(DataType.STRING(50))
  statusMessage!: string;

  @Column(DataType.TEXT)
  introduction!: string;

  @Column(DataType.STRING(80))
  github!: string;

  @Column(DataType.JSON)
  following!: number[];

  @Column(DataType.JSON)
  follower!: number[];

  @Column(DataType.BIGINT)
  feed!: number;

  @HasMany(() => ProfileChat)
  userchat!: ProfileChat[];

  @ForeignKey(() => User)
  @Column
  userId!: number;

  @BelongsTo(() => User, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  user!: User;

  @HasMany(() => Projectprofile)
  projectprofile!: Projectprofile[];

  @HasMany(() => Comments)
  commentsprofile!: Comments[];

  @HasMany(() => Applyprojectprofile)
  applyprojectprofile!: Applyprojectprofile[];

  @HasMany(() => Likeprojectprofile)
  likeprojectprofile!: Likeprojectprofile[];
}
