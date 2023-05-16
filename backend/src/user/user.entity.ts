/* eslint-disable prettier/prettier */
// user.entity.ts
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  
  @Entity()
  export class User {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ unique: true })
    email: string;
  
    @Column()
    password: string;
  
    @Column({ nullable: true })
    name: string;
  
    @Column('text', { array: true, default: '{}' })
    integrations: string[];
  
    @Column({ nullable: true })
    organisation: string;
  
    @Column({ default: false })
    isVerified: boolean;
  }
  