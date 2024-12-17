import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import { LoggerModule } from './logger/logger.module';
import path from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from './jwt/jwt.module';
import { CryptoModule } from './crypto/crypto.module';
import { UserModule } from './user/user.module';
import { SuiteModule } from './suite/suite.module';
import { CheckoutModule } from './checkout/checkout.module';
import { AdminSeederModule } from './seeder/admin-seeder.module';
import { AdminSeederService } from './seeder/admin-seeder.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
      ],
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    LoggerModule,
    CryptoModule,
    JwtModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    SuiteModule,
    CheckoutModule,
    AdminSeederModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly adminSeederService: AdminSeederService) {}

  async onModuleInit() {
    // Run the seeder on module initialization (you can comment this if not needed on startup)
    try {
      console.log('Running admin seeder...');
      await this.adminSeederService.seed();
      console.log('Admin seeding completed.');
    } catch (error) {
      console.error('Error during seeding:', error);
    }
  }
}
