// checkout.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StripeModule } from 'nestjs-stripe';
import { CheckoutController } from './checkout.controller';
import { CheckoutService } from './checkout.service';
import { SuiteSchema } from 'src/suite/suite.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Suite', schema: SuiteSchema }]),
    StripeModule.forRoot({
      apiKey: 'your-stripe-secret-key',
      apiVersion: '2024-11-20.acacia',
    }),
  ],
  controllers: [CheckoutController],
  providers: [CheckoutService],
})
export class CheckoutModule {}