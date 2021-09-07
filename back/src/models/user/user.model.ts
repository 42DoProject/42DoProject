import { Table, Column, Model, DataType, HasOne } from "sequelize-typescript";
import { OToken } from "./otoken.model";
import { Token } from "./token.model";

@Table
export class User extends Model {
  @Column(DataType.INTEGER)
  intraId!: number;

  @Column(DataType.STRING(30))
  username!: string;

  @Column(DataType.STRING(50))
  name!: string;

  @Column(DataType.STRING(80))
  email!: string;

  @Column(DataType.STRING(80))
  profileImage!: string;

  @HasOne(() => OToken)
  otoken?: OToken;

  @HasOne(() => Token)
  token?: Token;
}
