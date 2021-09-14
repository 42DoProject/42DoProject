import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { IHistory } from "../../interface/profile.interface";
import { User } from "./user.model";

@Table({ timestamps: false })
export class Profile extends Model {
  @Column(DataType.INTEGER)
  level!: number;

  @Column(DataType.STRING(20))
  lastAccess!: string;

  @Column(DataType.STRING(50))
  statusMessage!: string;

  @Column(DataType.TEXT)
  introduction!: string;

  @Column(DataType.JSON)
  history!: IHistory[];

  @Column(DataType.JSON)
  following!: number[];

  @Column(DataType.JSON)
  follower!: number[];

  @Column(DataType.JSON)
  chat!: string[];

  @ForeignKey(() => User)
  @Column
  userId?: number;

  @BelongsTo(() => User, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  user?: User;
}
