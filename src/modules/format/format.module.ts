import { Module } from '@nestjs/common'
import { FormatService } from './format.service'
import { FormatController } from './format.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Format } from './entities/format.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Format])],
  controllers: [FormatController],
  providers: [FormatService],
  exports: [TypeOrmModule, FormatService]
})
export class FormatModule {}
