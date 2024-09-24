import { Controller, Post, Body, HttpException, HttpStatus, Logger, Headers } from '@nestjs/common'
import { StripeService } from './stripe.service'
import type Stripe from 'stripe'
import { ApiTags } from '@nestjs/swagger'
import { MailService } from '../mail/mail.service'

@ApiTags('stripe')
@Controller('stripe')
export class StripeController {
  private readonly logger = new Logger(StripeService.name)

  constructor (private readonly stripeService: StripeService, private readonly mailService: MailService) {}

  @Post('payment-intent')
  async createPaymentIntent (
    @Body('amount') amount: number,
      @Body('currency') currency: string
  ): Promise<Stripe.PaymentIntent> {
    try {
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (!amount || amount <= 0) {
        throw new HttpException('Amount must be a positive number.', HttpStatus.INTERNAL_SERVER_ERROR)
      }
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (!currency) {
        throw new HttpException('Currency is required.', HttpStatus.INTERNAL_SERVER_ERROR)
      }

      return await this.stripeService.createPaymentIntent(amount, currency)
    } catch (error) {
      throw new HttpException('Failed to create payment intent', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Post('create-checkout-session')
  async createCheckoutSession (
    @Body('email') email: string,
      @Body('price') price: number,
      @Body('currency') currency: string
  ): Promise<{ url: string }> {
    try {
      if (price === null || price <= 0) {
        throw new HttpException('Price must be a positive number.', HttpStatus.INTERNAL_SERVER_ERROR)
      }
      if (currency === null) {
        throw new HttpException('Currency is required.', HttpStatus.INTERNAL_SERVER_ERROR)
      }

      const session = await this.stripeService.createCheckoutSession(
        email,
        price,
        currency
      )

      this.logger.warn('creating checkout session', session)

      if (session.url == null) {
        throw new HttpException('Session URL is null', HttpStatus.INTERNAL_SERVER_ERROR)
      }
      return { url: session.url }
    } catch (error) {
      this.logger.error('Error creating checkout session', error.stack)
      throw new HttpException('Failed to create checkout session', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Post('webhook')
  async handleStripeWebhook (@Body() body: any, @Headers('stripe-signature') signature: string): Promise<string> {
    try {
      const event = await this.stripeService.constructEventFromPayload(body, signature)
      await this.stripeService.handleEvent(event)
      return 'success'
    } catch (error) {
      this.logger.error('Webhook signature verification failed', error.stack)
      throw new HttpException(`Webhook Error: ${error.message}`, HttpStatus.BAD_REQUEST)
    }
  }

  @Post('send-email')
  async sendEmail (@Body() body: any): Promise<{ message: string }> {
    await this.mailService.sendEmail()
    return { message: 'Email sent successfully.' }
  }
}
