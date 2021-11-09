import { Table, Column, Model, ForeignKey, BelongsTo, DataType, HasMany } from "sequelize-typescript";
import { Lounge } from "./lounge.model";
import { Profile } from "../user/profile.model";

@Table
export class Replyoflounge extends Model {
    @Column(DataType.TEXT)
    comment!: string;

    @Column(DataType.INTEGER)
    like!: number;

    @ForeignKey(() => Profile)
    @Column
    profileId!: number

    @ForeignKey(() => Lounge)
    @Column
    loungeId!: number

    @BelongsTo(() => Profile)
    profile!: Profile;

    @BelongsTo(() => Lounge)
    lounge!: Lounge;
}