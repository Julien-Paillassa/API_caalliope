import { Test, type TestingModule } from '@nestjs/testing'
import { StripeService } from './stripe.service'
import Stripe from 'stripe'

jest.mock('stripe') // Mock Stripe

describe('StripeService', () => {
  let stripeService: StripeService
  let stripeMock: jest.Mocked<Stripe>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StripeService]
    }).compile()

    stripeService = module.get<StripeService>(StripeService)

    // Mock the Stripe instance
    stripeMock = new Stripe('your-api-key', { apiVersion: '2024-06-20' }) as unknown as jest.Mocked<Stripe>

    // Mocking paymentIntents.create method
    stripeMock.paymentIntents = {
      create: jest.fn() // Mock the create method of paymentIntents
    } as unknown as jest.Mocked<Stripe.PaymentIntentsResource>

    // Mocking the sessions.create method of checkout
    stripeMock.checkout = {
      sessions: {
        create: jest.fn() // Mock the create method of checkout sessions
      }
    } as unknown as { sessions: jest.Mocked<Stripe.Checkout.SessionsResource> }

    // Mocking webhooks.constructEvent method
    stripeMock.webhooks = {
      constructEvent: jest.fn().mockImplementation(() => ({} as Stripe.Event))
    } as unknown as jest.Mocked<Stripe.Webhooks>
  })

  describe('createPaymentIntent', () => {
    it('should create a payment intent', async () => {
      const mockPaymentIntent = { id: 'pi_123', amount: 2000, currency: 'usd' } as Stripe.PaymentIntent
      (stripeMock.paymentIntents.create as jest.Mock).mockResolvedValue(mockPaymentIntent)

      const result = await stripeService.createPaymentIntent(2000, 'usd')

      expect(result).toEqual(mockPaymentIntent)
    })

    it('should throw an error if creating payment intent fails', async () => {
      (stripeMock.paymentIntents.create as jest.Mock).mockRejectedValue(new Error('Stripe error'))

      await expect(stripeService.createPaymentIntent(2000, 'usd')).rejects.toThrow(
        'Erreur lors de la création du Payment Intent: Stripe error'
      )
    })
  })

  describe('createCheckoutSession', () => {
    it('should create a checkout session', async () => {
      const mockSession = { id: 'cs_test_123' } as Stripe.Checkout.Session
      (stripeMock.checkout.sessions.create as jest.Mock).mockResolvedValue(mockSession)

      const result = await stripeService.createCheckoutSession('test@example.com', 5000, 'usd')

      expect(result).toEqual(mockSession)
    })

    it('should throw an error if creating checkout session fails', async () => {
      (stripeMock.checkout.sessions.create as jest.Mock).mockRejectedValue(new Error('Stripe error'))

      await expect(stripeService.createCheckoutSession('test@example.com', 5000, 'usd')).rejects.toThrow(
        'Erreur lors de la création de la session de checkout: Stripe error'
      )
    })
  })

  describe('constructEventFromPayload', () => {
    const mockPayload = { id: 'evt_test' }
    const mockSignature = 'signature'

    it('should construct an event from payload', async () => {
      const mockEvent = { id: 'evt_123', type: 'checkout.session.completed' } as Stripe.Event
      (stripeMock.webhooks.constructEvent as jest.Mock).mockReturnValue(mockEvent)

      const result = await stripeService.constructEventFromPayload(mockPayload, mockSignature)

      expect(result).toEqual(mockEvent)
    })

    it('should throw an error if webhook signature verification fails', async () => {
      (stripeMock.webhooks.constructEvent as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid signature')
      })

      await expect(stripeService.constructEventFromPayload(mockPayload, mockSignature)).rejects.toThrow(
        'Webhook signature verification failed: Invalid signature'
      )
    })
  })

  describe('handleEvent', () => {
    it('should handle "checkout.session.completed" event', async () => {
      const mockEvent = {
        type: 'checkout.session.completed',
        data: {
          object: { id: 'cs_test_123' }
        }
      } as Stripe.Event

      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation()

      await stripeService.handleEvent(mockEvent)

      expect(consoleLogSpy).toHaveBeenCalledWith('Checkout Session completed:', mockEvent.data.object)
    })

    it('should warn on unhandled event types', async () => {
      const mockEvent = { type: 'unknown.event' } as unknown as Stripe.Event
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation()

      await stripeService.handleEvent(mockEvent)

      expect(consoleWarnSpy).toHaveBeenCalledWith('Unhandled event type unknown.event')
    })
  })
})
