/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, ManyToOne, JoinColumn } from 'typeorm';
import { UserGroup } from '../user-management/userGroup.entity';
import { Organisation } from '../user-management/organisation.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({nullable: true})
  salt: string;

  @Column({nullable: true})
  firstName: string;

  @Column({nullable: true})
  lastName: string;

  @Column({ type: 'json', nullable: true })
  integrations: string[];

  @ManyToMany(() => UserGroup, (userGroup) => userGroup.users, { nullable: true })
  @JoinTable()
  userGroups: UserGroup[];

  @ManyToOne(() => Organisation, (organisation) => organisation.users, { nullable: true })
  @JoinColumn({ name: 'organisationId' })
  organisation: Organisation;

  @Column({ nullable: true })
  organisationId: number;
}

