import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity('watched_users')
export class WatchedUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  person: string;

  @Column()
  email: string;

  @Column("json")
  types: { type: string; threshold: number; }[];

  @Column("simple-array")
  domains: string[];
}
