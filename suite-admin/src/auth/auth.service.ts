import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { TokenService } from '../user/token.service';
import { CryptoService } from '../crypto/crypto.service';
import { CreateUserDto } from './dtos/create-admin.dto';
import { LoginUserDto } from './dtos/login-admin.dto';
import { I18nService } from 'nestjs-i18n';
import { AppLogger } from '../logger/app-logger.service';
import { AdminDocument } from 'src/user/schemas/admin.schema';
import { AdminService } from 'src/user/admin.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly cryptoService: CryptoService,
    private readonly adminService: AdminService,
    private readonly i18n: I18nService,
    private readonly logger: AppLogger,
  ) {}

  async getAdminUser(user: AdminDocument): Promise<AdminDocument> {
    if (!user) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    // Additional check for admin privileges
    if (!user) {
      throw new HttpException(
        'Forbidden: Not an admin user',
        HttpStatus.FORBIDDEN,
      );
    }

    return user;
  }

  async login(loginUserDto: LoginUserDto) {
    try {
      // Find user by email
      const user = await this.adminService.findOneAdminByEmail(
        loginUserDto.email,
      );
      if (!user) {
        throw new HttpException(
          this.i18n.translate('auth.notFoundUser'),
          HttpStatus.BAD_REQUEST,
        );
      }

      // Check password
      const isMatch = await this.cryptoService.comparePasswords(
        loginUserDto.password,
        user.password,
      );
      if (!isMatch) {
        throw new HttpException(
          this.i18n.translate('auth.wrongPassword'),
          HttpStatus.BAD_REQUEST,
        );
      }

      // Create token
      const token = await this.tokenService.create({ user });
      return { user, token };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        this.i18n.translate('errors.server'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async logout(userId: string, jti: string) {
    try {
      await this.tokenService.revokeByJtiAndUserId(userId, jti);
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        this.i18n.translate('errors.server'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
