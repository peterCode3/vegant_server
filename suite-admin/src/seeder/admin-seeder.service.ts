import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Admin, AdminDocument, AdminRole } from 'src/user/schemas/admin.schema';

@Injectable()
export class AdminSeederService {
  private readonly logger = new Logger(AdminSeederService.name);

  constructor(
    @InjectModel(Admin.name) private readonly adminModel: Model<AdminDocument>,
  ) {}

  async seed(): Promise<void> {
    const admins = [
      {
        name: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
        password: 'Hello@123',
        role: AdminRole.ADMIN, // Regular admin
      },
      {
        name: 'Super',
        lastName: 'Admin',
        email: 'superadmin@example.com',
        password: 'Hello@123',
        role: AdminRole.SUPERADMIN, // Regular admin
      },
    ];

    for (const admin of admins) {
      const existingAdmin = await this.adminModel.findOne({
        email: admin.email,
      });
      if (existingAdmin) {
        this.logger.log(
          `Admin with email ${admin.email} already exists. Skipping...`,
        );
        continue;
      }

      // Hash the password before saving
      admin.password = await bcrypt.hash(admin.password, 10);
      await this.adminModel.create(admin);
      this.logger.log(`Admin with email ${admin.email} has been created.`);
    }

    this.logger.log('Admin seeding completed.');
  }
}
