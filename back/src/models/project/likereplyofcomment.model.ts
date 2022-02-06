import { Table, Column, Model, ForeignKey, BelongsTo } from "sequelize-typescript";
import { Replyofcomment } from "./replyofcomment.model";
import { Profile } from "../user/profile.model";

@Table
export class Likereplyofcomment extends Model {
    @ForeignKey(() => Profile)
    @Column
    profileId!: number

    @ForeignKey(() => Replyofcomment)
    @Column
    replyofcommentId!: number

    @BelongsTo(() => Profile)
    profile!: Profile;

    @BelongsTo(() => Replyofcomment)
    Replyofcomment!: Replyofcomment;
}