/* eslint-disable prettier/prettier */
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ type: 'json', nullable: true })
  integrations: string[];

  @Column({ nullable: true })
  organisations: string;

  @Column({ type: 'json', nullable: true })
  userGroups: string[];
}

