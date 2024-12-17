import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SuiteSchema } from './suite.schema';
import { SuiteController } from './suite.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Suite', schema: SuiteSchema }])],
  controllers: [SuiteController],
})
export class SuiteModule {}
