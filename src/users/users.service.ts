import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) : Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll() : Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findByUsername(username: string){
    return this.userModel.findOne({username: username}).exec();
  }

  async update(updateUserDto: UpdateUserDto) : Promise<User> {
    const updateUsername = updateUserDto.username;
    const existingUser = await this.userModel.findOne({username: updateUsername}).exec();

    existingUser.password = updateUserDto.password;
    return existingUser.save();
  }

  async validate(username: string, password: string) : Promise<boolean>{
    const user = await this.userModel.findOne({username: username});
    return user.validatePassword(password);
  }

  remove(username: string) {
    return this.userModel.remove({username: username}).exec();
  }
}
