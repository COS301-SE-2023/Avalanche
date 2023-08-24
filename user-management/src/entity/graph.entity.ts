import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, PrimaryColumn } from 'typeorm';
import { Filter } from './filter.entity';
import { Endpoint } from './endpoint.entity';

@Entity()
export class Graph {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn()
  graphName: string;
  @PrimaryColumn()
  user: string;

  @ManyToOne(() => Endpoint, endpoint => endpoint.graphs) 
  endpoint: Endpoint;

  @OneToMany(() => Filter, filter => filter.graph) 
  filters: Filter[];
}
