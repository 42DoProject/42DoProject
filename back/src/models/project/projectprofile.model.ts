import { Table, Column, Model, ForeignKey, BelongsTo, DataType } from "sequelize-typescript";
import { Project } from "./project.model";
import { Profile } from "../user/profile.model";

@Table
export class Projectprofile extends Model {
    @Column(DataType.INTEGER)
    position!: number;

    @ForeignKey(() => Project)
    @Column
    projectId!: number

    @ForeignKey(() => Profile)
    @Column
    profileId!: number

    @BelongsTo(() => Project)
    project!: Project;

    @BelongsTo(() => Profile)
    profile!: Profile;
}