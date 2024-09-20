import { Module } from '@nestjs/common'
import { StripeService } from './stripe.service'
import { StripeController } from './stripe.controller'

@Module({
  providers: [StripeService],
  controllers: [StripeController],
  exports: [StripeService] // Exporte le service si nécessaire dans d'autres modules
})
export class StripeModule {}
