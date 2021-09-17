import { Table, Column, Model, ForeignKey, BelongsTo } from "sequelize-typescript";
import { Comments } from "./comments.model";
import { Profile } from "../user/profile.model";

@Table
export class Commentsprofile extends Model {
    @ForeignKey(() => Comments)
    @Column
    commentsId!: number

    @ForeignKey(() => Profile)
    @Column
    userId!: number

    @BelongsTo(() => Comments)
    comments!: Comments;

    @BelongsTo(() => Profile)
    profile!: Profile;
}