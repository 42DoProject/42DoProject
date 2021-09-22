import {
  Model,
  Table,
  Column,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { Profile } from "../user/profile.model";
import { Chat } from "./chat.model";

@Table({ timestamps: false })
export class ProfileChat extends Model {
  @ForeignKey(() => Profile)
  @Column
  profileId!: number;

  @ForeignKey(() => Chat)
  @Column
  chatId!: string;

  @BelongsTo(() => Profile)
  profile!: Profile;

  @BelongsTo(() => Chat)
  chat!: Chat;
}
