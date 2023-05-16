/* eslint-disable prettier/prettier */
// user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  create(userDto: any): Promise<User> {
    const user = this.usersRepository.create(userDto) as unknown as User;
    return this.usersRepository.save(user) as Promise<User>;
  }


  findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ where: { email } });
  }

  // findByJWT(jwt: string): Promise<User> {
  //   return this.usersRepository.findOne({ where: { jwt } });
  // }


}
