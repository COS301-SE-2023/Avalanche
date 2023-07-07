/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Dashboard } from "./dashboard.entity";

@Entity()
export class Graph {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column("simple-array", { nullable: true })
  filters: string[];

  @ManyToOne(() => Dashboard, (dashboard) => dashboard.graphs)
  dashboard: Dashboard;
}