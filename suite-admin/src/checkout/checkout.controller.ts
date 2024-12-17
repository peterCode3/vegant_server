// checkout.controller.ts
import { Controller, Post, Param, Body, Get, Query, UseGuards } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id')
  async createCheckout(@Param('id') id: string, @Body('quantity') quantity: number) {
    if (!quantity || quantity <= 0) {
      throw new Error('Quantity must be a positive number');
    }

    const session = await this.checkoutService.createCheckoutSession(id, quantity);
    return { checkoutUrl: session.url };
  }


  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('success')
  async success(@Query('session_id') sessionId: string) {
    if (!sessionId) {
      throw new Error('Session ID is missing');
    }

    // Call service method to process the success logic
    const result = await this.checkoutService.handlePaymentSuccess(sessionId);

    return { message: `Payment successful with session ID: ${result.sessionId}` };
  }


  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('status')
  async status(@Query('suite_id') sessionId: string) {
    if (!sessionId) {
      throw new Error('Suite ID is missing');
    }

    // Call service method to process the success logic
    const result = await this.checkoutService.checkSuccess(sessionId);

    return { message: `Status is ${result.status}`, status: result.status };
  }


  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('cancel')
  cancel() {
    return { message: 'Payment was cancelled' };
  }
}