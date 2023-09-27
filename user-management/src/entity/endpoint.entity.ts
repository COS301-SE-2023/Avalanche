import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Graph } from './graph.entity';
import { Dashboard } from './frontendDashboard.entity';

@Entity()
export class Endpoint {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  endpoint: string;

  @OneToMany(() => Graph, graph => graph.endpoint) // Corrected here
  graphs: Graph[];

  @OneToMany(() => Dashboard, dashboard => dashboard.endpoint) // Corrected here
  dashboards: Dashboard[];
}

