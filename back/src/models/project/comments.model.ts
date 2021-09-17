import { Table, Column, ForeignKey, Model, DataType, BelongsTo, HasMany } from "sequelize-typescript";
import { Commentsprofile } from "./commentsprofile.model";
import { Content } from "./content.model";

@Table
export class Comments extends Model {
    @Column(DataType.TEXT)
    comment!: string;

    @ForeignKey(() => Content)
    @Column
    contentId!: number;

    @BelongsTo(() => Content)
    content!: Content;

    @HasMany(() => Commentsprofile)
    commentsprofile!: Commentsprofile[];
}
