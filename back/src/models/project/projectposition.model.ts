import {
    Table,
    Column,
    Model,
    ForeignKey,
    BelongsTo,
  } from "sequelize-typescript";
  import { Project } from "./project.model";
  import { Position } from "./position.model";
  
  @Table
  export class Projectposition extends Model {
    @ForeignKey(() => Project)
    @Column
    projectId!: number;
  
    @ForeignKey(() => Position)
    @Column
    positionId!: number;
  
    @BelongsTo(() => Project)
    project!: Project;
  
    @BelongsTo(() => Position)
    position!: Position;
  }
  