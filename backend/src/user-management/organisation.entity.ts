/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from '../auth/user.entity';
import { UserGroup } from './userGroup.entity';

@Entity()
export class Organisation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => UserGroup, (userGroup) => userGroup.organisation)
  userGroups: UserGroup[];

  @OneToMany(() => User, (user) => user.organisation)
  users: User[];
}