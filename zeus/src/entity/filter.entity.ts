import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
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

  @Column('json',{ nullable: true })
  values: any[]; // Define the specific structure if needed
  
  @Column()
  input: string;
}


