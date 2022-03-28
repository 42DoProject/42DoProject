import { Table, Column, ForeignKey, Model, DataType, BelongsTo, HasMany } from "sequelize-typescript";
import { Profile } from "../user/profile.model";
import { Content } from "./content.model";

@Table
export class Comments extends Model {
    @Column(DataType.TEXT)
    comment!: string;

    @Column(DataType.INTEGER)
    like!: number;

    @Column(DataType.INTEGER)
    replyCount!: number;

    @ForeignKey(() => Content)
    @Column
    contentId!: number;

    @ForeignKey(() => Profile)
    @Column
    profileId!: number;

    @BelongsTo(() => Content)
    content!: Content;

    @BelongsTo(() => Profile)
    profile!: Profile;
}