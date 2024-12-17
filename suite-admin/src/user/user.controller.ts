import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import MongooseClassSerializerInterceptor from '../mongoose/interceptors/mongoose-class-serializer.interceptor';
import { User, User as UserModel } from '../user/schemas/user.schema';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateUserDto } from 'src/auth/dtos/create-admin.dto';

@Controller()
@UseInterceptors(MongooseClassSerializerInterceptor(UserModel))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('admin/users')
  async listAllUsers() {
    const users = await this.userService.findAllUsers();
    return users;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('admin/users/:userId')
  async getUserDetails(@Param('userId') userId: string) {
    const user = await this.userService.findOneUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put('admin/users/:userId')
  async updateUser(
    @Param('userId') userId: string,
    @Body() updates: Partial<User>, // Directly map the body to `updates`
  ) {
    console.log('updates', updates); // Debugging logs
    const updatedUser = await this.userService.updateUser(userId, updates);
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return updatedUser;
  }

  @Delete('admin/users/:userId')
  async deleteUser(@Param('userId') userId: string) {
    const result = await this.userService.deleteUser(userId);
    if (!result) {
      throw new NotFoundException('User not found');
    }
    return {
      message: 'User deleted successfully',
    };
  }

  @Post('admin/users')
  async createUser(@Body() createUserDto: CreateUserDto) {
    const newUser = await this.userService.createFromDto(createUserDto);
    return {
      message: 'User created successfully',
      user: newUser,
    };
  }
}
