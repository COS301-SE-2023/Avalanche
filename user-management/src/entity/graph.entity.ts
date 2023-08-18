import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { Filter } from './filter.entity';
import { Endpoint } from './endpoint.entity';

@Entity()
export class Graph {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Endpoint, endpoint => endpoint.graphs) // Added here
  endpoint: Endpoint;

  @OneToMany(() => Filter, filter => filter.graph) // Corrected here
  filters: Filter[];
}
