import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin, AdminDocument } from './schemas/admin.schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
  ) {}

  async findOneAdminById(id: string): Promise<AdminDocument> {
    return this.adminModel.findById(id);
  }

  async findOneAdminByEmail(email: string): Promise<AdminDocument> {
    return this.adminModel.findOne({
      email: email,
    });
  }
}
