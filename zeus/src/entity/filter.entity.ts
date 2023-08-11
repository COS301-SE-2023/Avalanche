import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { Value } from './value.entity';
import { Graph } from './graph.entity';

@Entity()
export class Filter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: string;

  @ManyToOne(() => Graph, graph => graph.filters) 
  graph: Graph;

  @OneToMany(() => Value, value => value.filter)
  values: Value[];
  
  @Column()
  input: string;
}


