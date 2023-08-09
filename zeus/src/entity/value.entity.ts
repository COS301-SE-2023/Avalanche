import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Filter } from './filter.entity';

export interface NestedFilter {
  name: string;
  type: string;
  values: string[];
  input: string;
}

export type ValueStructure = string[] | NestedFilter[];

@Entity()
export class Value {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('json')
  values: ValueStructure;

  @Column()
  input: string;

  @ManyToOne(() => Filter, filter => filter.values)
  filter: Filter;
}
