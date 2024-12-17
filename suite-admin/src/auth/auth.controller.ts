import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import MongooseClassSerializerInterceptor from '../mongoose/interceptors/mongoose-class-serializer.interceptor';
import { JwtAuthGuard } from './jwt-auth.guard';
import { User as AdminDecorator } from './decorators/admin.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { LoginUserDto } from './dtos/login-admin.dto';
import { Response } from 'express';
import { COOKIE_JWT_KEY } from './constants';
import { AuthService } from './auth.service';
import {
  AdminDocument,
  Admin as AdminModel,
} from 'src/user/schemas/admin.schema';

@Controller()
@UseInterceptors(MongooseClassSerializerInterceptor(AdminModel))
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('auth/me')
  async getAdminUser(@AdminDecorator() admin: AdminDocument) {
    return this.authService.getAdminUser(admin);
  }

  @Post('auth/login')
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { user, token } = await this.authService.login(loginUserDto);
    response.cookie(COOKIE_JWT_KEY, token, {
      httpOnly: true,
      sameSite: 'strict',
    });
    return { user, token };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('auth/logout')
  async logout(
    @Res({ passthrough: true }) response: Response,
    @AdminDecorator() user: AdminDocument,
  ) {
    await this.authService.logout(user._id, user.tokens[0].jti);
    response.clearCookie(COOKIE_JWT_KEY);
    return {};
  }
}
