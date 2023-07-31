/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { UserGroup } from './userGroup.entity';
import { Organisation } from './organisation.entity';
import { Dashboard } from './dashboard.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  salt: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  apiKey: string;

  @Column("simple-array", { nullable: true })
  products: string[];

  @ManyToMany(() => UserGroup, (userGroup) => userGroup.users, { nullable: true })
  @JoinTable()
  userGroups: UserGroup[];

  @ManyToOne(() => Organisation, (organisation) => organisation.users, { nullable: true })
  @JoinColumn({ name: 'organisationId' })
  organisation: Organisation;

  @ManyToMany(() => Dashboard, (dashboard) => dashboard.user, { nullable: true })
  @JoinTable()
  dashboards: Dashboard[];

  @Column({ nullable: true })
  organisationId: number;
}

