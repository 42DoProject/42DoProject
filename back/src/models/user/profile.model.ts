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
import { Projectprofile } from "../project/projectprofile.model";
import { Comments } from "../project/comments.model";

@Table({ timestamps: false })
export class Profile extends Model {
  @Column(DataType.FLOAT)
  level!: Number;

  @Column(DataType.STRING(20))
  lastAccess!: string;

  @Column(DataType.INTEGER)
  status!: Number;

  @Column(DataType.JSON)
  position!: Number;

  @Column(DataType.JSON)
  skill!: Number[];

  @Column(DataType.STRING(50))
  statusMessage!: string;

  @Column(DataType.TEXT)
  introduction!: string;

  @Column(DataType.STRING(50))
  github!: string;

  @Column(DataType.JSON)
  following!: number[];

  @Column(DataType.JSON)
  follower!: number[];

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
}
