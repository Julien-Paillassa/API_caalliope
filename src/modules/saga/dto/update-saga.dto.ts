import { PartialType } from '@nestjs/mapped-types'
import { CreateSagaDto } from './create-saga.dto'

export class UpdateSagaDto extends PartialType(CreateSagaDto) {}
