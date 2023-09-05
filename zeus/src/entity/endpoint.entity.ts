import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Graph } from './graph.entity';

@Entity()
export class Endpoint {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  endpoint: string;

  @OneToMany(() => Graph, graph => graph.endpoint) 
  graphs: Graph[];
}

