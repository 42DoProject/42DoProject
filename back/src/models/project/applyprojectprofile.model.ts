import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import { Project } from "./project.model";
import { Profile } from "../user/profile.model";

@Table
export class Applyprojectprofile extends Model {
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