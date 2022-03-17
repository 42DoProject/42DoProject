import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
  ForeignKey,
  AllowNull,
} from "sequelize-typescript";
import { User } from "./user.model";

@Table({ timestamps: false })
export class OToken extends Model {
  @AllowNull
  @Column(DataType.INTEGER)
  application!: number;

  @AllowNull
  @Column(DataType.STRING(300))
  accessToken!: string;

  @AllowNull
  @Column(DataType.STRING(300))
  refreshToken!: string;

  @AllowNull
  @Column(DataType.INTEGER)
  expiryDate!: number;

  @ForeignKey(() => User)
  @Column
  userId?: number;

  @BelongsTo(() => User, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  user?: User;
}
