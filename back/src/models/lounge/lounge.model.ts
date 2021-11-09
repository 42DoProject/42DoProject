import { Table, Column, ForeignKey, Model, DataType, BelongsTo, HasMany } from "sequelize-typescript";
import { Replyoflounge } from "./replyoflounge.model";
import { Profile } from "../user/profile.model";

@Table
export class Lounge extends Model {
    @Column(DataType.TEXT)
    comment!: string;

    @Column(DataType.INTEGER)
    like!: number;

    @Column(DataType.INTEGER)
    replyCount!: number;

    @ForeignKey(() => Profile)
    @Column
    profileId!: number;

    @BelongsTo(() => Profile)
    profile!: Profile;

    @HasMany(() => Replyoflounge)
    replyoflounge!: Replyoflounge[];
}