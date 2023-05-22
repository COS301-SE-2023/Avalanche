/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Organisation } from './organisation.entity';

@Entity()
export class UserGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  permission: number;

  @ManyToOne(() => Organisation, (organisation) => organisation.userGroups)
  @JoinColumn({ name: 'organisationId' })
  organisation: Organisation;

  @ManyToMany(() => User, (user) => user.userGroups)
  users: User[];

  @Column({ nullable: true })
  organisationId: number;

  @Column("simple-array", { nullable: true })
  products: string[];
}