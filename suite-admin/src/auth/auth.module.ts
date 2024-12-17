import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { CryptoService } from '../crypto/crypto.service';
import { AuthService } from './auth.service';
import { AdminService } from 'src/user/admin.service';
import { Admin, AdminSchema } from 'src/user/schemas/admin.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
  ],
  controllers: [AuthController],
  providers: [CryptoService, AuthService, AdminService],
})
export class AuthModule {}
