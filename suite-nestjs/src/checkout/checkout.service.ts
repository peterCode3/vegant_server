// checkout.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Suite } from 'src/suite/suite.model';
import { SuiteSchema } from 'src/suite/suite.schema';
import Stripe from 'stripe';

export type SuiteDocument = Suite & Document;

@Injectable()
export class CheckoutService {
  private stripe: Stripe;

  constructor(
    @InjectModel('Suite') private readonly suiteModel: Model<SuiteDocument>,
  ) {
    this.stripe = new Stripe(
      'sk_test_51PjcnfKf9wCY0IEjtMWTgvsDUAikju1YfBGh9vhzC7yLoHY7cqUeZbMFTWUsxvgh6TH2V99Ml9Rxgpm2lq8xoRiN00IlixwRTF',
      {
        apiVersion: '2024-11-20.acacia',
      },
    );
  }

  async handlePaymentSuccess(sessionId: string) {
    // Find the suite with 'pending' checkoutStatus (this assumes the suite document is marked as pending before payment)
    const suite = await this.suiteModel
      .findOne({ checkoutStatus: 'pending' })
      .lean();

    if (!suite) {
      throw new Error('Suite not found for the given session');
    }

    // Update the suite to mark the order as completed and save the session ID
    const updatedSuite = await this.suiteModel.findByIdAndUpdate(
      suite._id,
      {
        $set: { checkoutStatus: 'completed', stripeSessionId: sessionId },
      },
      { new: true },
    );

    return { sessionId: updatedSuite.stripeSessionId };
  }
  async checkSuccess(suiteID: string) {
    const suite = await this.suiteModel
      .findOne({ _id: suiteID })
      .lean();

    if (!suite) {
      throw new Error('Suite not found for the given session');
    }

    return { status: suite.checkoutStatus };
  }

  // checkout.service.ts
  async createCheckoutSession(suiteId: string, quantity: number) {
    const suite = await this.suiteModel.findById(suiteId).lean();

    if (!suite) {
      throw new Error('Suite not found');
    }

    // Update suite with a "pending" status
    await this.suiteModel.findByIdAndUpdate(suiteId, {
      $set: { checkoutStatus: 'pending', quantity: quantity },
    });

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: suite.febricaSelection,
              description: suite.style,
            },
            unit_amount: parseInt(suite.price, 10) * 100,
          },
          quantity: quantity,
        },
      ],
      mode: 'payment',
      success_url:
        'http://localhost:4000/checkout/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:4000/checkout/cancel',
    });

    return session;
  }
}
