/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToMany } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Dashboard {
  @PrimaryGeneratedColumn()
  autoID: number;

  @Column()
  name: string;

  @Column()
  dashboardID : string;

  @ManyToMany(() => User, (user) => user.dashboards)
  @JoinColumn({ name: 'userId' })
  user: User[];

  @Column("json", { nullable: true })
  graphs : {graphName: string, endpointName: string, filters: string[], comments?: {userName: string, comment: string}[]}[]
}