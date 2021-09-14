import { Table, Column, Model, ForeignKey, BelongsTo } from "sequelize-typescript";
import { Project } from "./project.model";
import { Tag } from "./tag.model";

@Table
export class Projecttag extends Model {
    @ForeignKey(() => Project)
    @Column
    projectId!: number

    @ForeignKey(() => Tag)
    @Column
    tagId!: number

    @BelongsTo(() => Project)
    project!: Project;

    @BelongsTo(() => Tag)
    tag!: Tag;
}