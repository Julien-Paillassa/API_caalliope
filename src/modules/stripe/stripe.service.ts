import { Injectable } from '@nestjs/common'
import { stripeConfig } from './../../config/stripe.config'
import Stripe from 'stripe'

@Injectable()
export class StripeService {
  private readonly stripe: Stripe

  constructor () {
    this.stripe = new Stripe(stripeConfig.secretKey, {
      apiVersion: '2024-06-20' // Utilise la version API Stripe que tu souhaites
    })
  }

  async createPaymentIntent (amount: number, currency: string): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount,
        currency // Assurez-vous que le paramètre currency est inclus ici
      })
      console.log('Payment Intent:', paymentIntent)
      return paymentIntent
    } catch (error) {
      throw new Error(`Erreur lors de la création du Payment Intent: ${error.message}`)
    }
  }

  async createCheckoutSession (
    email: string,
    price: number,
    currency: string
  ): Promise<Stripe.Checkout.Session> {
    try {
      console.log('Price:', price)
      console.log('Email:', email)
      if (isNaN(price) || price <= 0) {
        throw new Error('Invalid price value. Must be a positive number.')
      }
      if (email === null || email === '') {
        throw new Error('Email is required.')
      }
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency,
              product_data: {
                name: email
              },
              unit_amount: price * 100
            },
            /* customer_email: email, */
            quantity: 1
          }

        ],
        mode: 'payment',
        customer_email: email,
        // success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        success_url: 'http://localhost:3000/donate/success',
        // cancel_url: `${process.env.CLIENT_URL}/cancel`
        cancel_url: 'http://localhost:3000/donate/cancel'
      })
      console.log('Checkout Session:', session)
      return session
    } catch (error) {
      throw new Error(`Erreur lors de la création de la session de checkout: ${error.message}`)
    }
  }

  async constructEventFromPayload (payload: any, signature: string): Promise<Stripe.Event> {
    const endpointSecret = stripeConfig.endpointSecret
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return this.stripe.webhooks.constructEvent(payload, signature, endpointSecret)
    } catch (error) {
      throw new Error(`Webhook signature verification failed: ${error.message}`)
    }
  }

  async handleEvent (event: Stripe.Event): Promise<void> {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        // Traitement spécifique pour une session de checkout réussie
        console.log('Checkout Session completed:', session)
        break
      }
      default: {
        console.warn(`Unhandled event type ${event.type}`)
      }
    }
  }
}
