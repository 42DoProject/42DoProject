import { Table, Column, Model, ForeignKey, BelongsTo } from "sequelize-typescript";
import { Lounge } from "./lounge.model";
import { Profile } from "../user/profile.model";

@Table
export class Likelounge extends Model {
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