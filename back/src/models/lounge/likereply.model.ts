import { Table, Column, Model, ForeignKey, BelongsTo } from "sequelize-typescript";
import { Replyoflounge } from "./replyoflounge.model";
import { Profile } from "../user/profile.model";

@Table
export class Likereply extends Model {
    @ForeignKey(() => Profile)
    @Column
    profileId!: number

    @ForeignKey(() => Replyoflounge)
    @Column
    replyofloungeId!: number

    @BelongsTo(() => Profile)
    profile!: Profile;

    @BelongsTo(() => Replyoflounge)
    Replyoflounge!: Replyoflounge;
}