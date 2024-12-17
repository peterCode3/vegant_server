import { Global, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { CryptoService } from '../crypto/crypto.service';
import { TokenService } from './token.service';
import { Admin, AdminSchema } from './schemas/admin.schema';
import { UserController } from './user.controller';
import { AdminService } from './admin.service';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Admin.name,
        schema: AdminSchema,
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, TokenService, CryptoService, AdminService],
  exports: [UserService, TokenService, AdminService],
})
export class UserModule {}
