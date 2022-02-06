import { Table, Column, Model, ForeignKey, BelongsTo, DataType } from "sequelize-typescript";
import { Comments } from "./comments.model";
import { Profile } from "../user/profile.model";

@Table
export class Replyofcomment extends Model {
    @Column(DataType.TEXT)
    comment!: string;

    @Column(DataType.INTEGER)
    like!: number;

    @ForeignKey(() => Profile)
    @Column
    profileId!: number

    @ForeignKey(() => Comments)
    @Column
    commentId!: number

    @BelongsTo(() => Profile)
    profile!: Profile;

    @BelongsTo(() => Comments)
    comments!: Comments;
}