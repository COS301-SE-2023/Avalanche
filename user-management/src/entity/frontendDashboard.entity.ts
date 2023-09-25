import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Endpoint } from './endpoint.entity';

@Entity()
export class Dashboard {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  user: string; // public, registrar, registry

  @Column('json') 
  graphs: {endpoint : string, filters : any}[];

  @ManyToOne(() => Endpoint, endpoint => endpoint.dashboards)
  endpoint: Endpoint;
}
