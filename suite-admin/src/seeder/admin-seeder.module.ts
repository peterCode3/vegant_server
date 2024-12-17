import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminSeederService } from './admin-seeder.service';
import { Admin, AdminSchema } from 'src/user/schemas/admin.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
  ],
  providers: [AdminSeederService],
  exports: [AdminSeederService],
})
export class AdminSeederModule {}
