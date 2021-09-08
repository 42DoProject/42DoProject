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
export class Token extends Model {
  @AllowNull
  @Column(DataType.STRING(200))
  accessToken!: string;

  @AllowNull
  @Column(DataType.INTEGER)
  accessExpiry!: number;

  @AllowNull
  @Column(DataType.STRING(200))
  refreshToken!: string;

  @AllowNull
  @Column(DataType.INTEGER)
  refreshExpiry!: number;

  @ForeignKey(() => User)
  @Column
  userId?: number;

  @BelongsTo(() => User, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  user?: User;
}
