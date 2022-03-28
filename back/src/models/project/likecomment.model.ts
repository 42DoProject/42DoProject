import { Table, Column, Model, ForeignKey, BelongsTo } from "sequelize-typescript";
import { Comments } from "./comments.model";
import { Profile } from "../user/profile.model";

@Table
export class Likecomment extends Model {
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