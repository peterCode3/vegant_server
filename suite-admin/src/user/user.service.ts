import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '../jwt/jwt.service';
import { CryptoService } from '../crypto/crypto.service';
import { Admin, AdminDocument } from './schemas/admin.schema';
import { CreateUserDto } from 'src/auth/dtos/create-admin.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
    private readonly jwtService: JwtService,
    private readonly cryptoService: CryptoService,
  ) {}

  async findAllUsers(): Promise<UserDocument[]> {
    return this.userModel.find({ role: 'customer' }).exec();
  }

  async createFromDto(dto: CreateUserDto): Promise<UserDocument> {
    return this.create({
      email: dto.email,
      password: dto.password,
      name: dto.name,
      lastName: dto.lastName,
    });
  }

  async create(user: User): Promise<AdminDocument> {
    const createdUser = new this.adminModel({
      ...user,
      password: await this.cryptoService.hashPassword(user.password),
    });
    return createdUser.save();
  }

  async findOneUserById(id: string): Promise<UserDocument> {
    return this.userModel.findById(id).exec(); // Retrieve user by ID
  }

  async updateUser(
    id: string,
    updates: Partial<User>, // Accept a partial User object for updates
  ): Promise<UserDocument> {
    if (updates?.password) {
      // Hash the password before updating
      updates.password = await this.cryptoService.hashPassword(
        updates.password,
      );
    }

    return this.userModel
      .findByIdAndUpdate(
        id,
        updates,
        { new: true }, // Return the updated user document
      )
      .exec();
  }

  async deleteUser(userId: string): Promise<boolean> {
    const result = await this.userModel.findByIdAndDelete(userId).exec();
    return result !== null; // Return true if a user was deleted, false otherwise
  }
}
