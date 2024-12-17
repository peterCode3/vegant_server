// suite.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SuiteSchema } from './suite.schema';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('suites')
export class SuiteController {
  constructor(
    @InjectModel('Suite') private readonly suiteModel: Model<typeof SuiteSchema>,
  ) {}

  // GET all suites

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllSuites() {
    return await this.suiteModel.find().exec();
  }

  // GET a single suite by ID

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getSuiteById(@Param('id') id: string) {
    return await this.suiteModel.findById(id).exec();
  }

  // POST a new suite

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async createSuite(@Body() createSuiteDto: any, @Request() req: any) {
    const newSuite = new this.suiteModel({
      ...createSuiteDto,
      user: req.user._id
    });
    return await newSuite.save();
  }

  // PUT to update a suite by ID

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateSuite(@Param('id') id: string, @Body() updateSuiteDto: any) {
    return await this.suiteModel.findByIdAndUpdate(id, updateSuiteDto, {
      new: true, // Return the updated document
    }).exec();
  }

  // DELETE a suite by ID

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteSuite(@Param('id') id: string) {
    return await this.suiteModel.findByIdAndDelete(id).exec();
  }
}
