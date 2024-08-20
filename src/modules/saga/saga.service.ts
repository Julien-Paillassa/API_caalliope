import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { type CreateSagaDto } from './dto/create-saga.dto'
import { type UpdateSagaDto } from './dto/update-saga.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Saga } from './entities/saga.entity'
import { Repository } from 'typeorm'

@Injectable()
export class SagaService {
  private readonly logger = new Logger(SagaService.name)

  constructor (
    @InjectRepository(Saga)
    private readonly sagaRepository: Repository<Saga>
  ) {}

  async create (createSagaDto: CreateSagaDto): Promise<Saga> {
    try {
      const saga = this.sagaRepository.create(createSagaDto)
      return await this.sagaRepository.save(saga)
    } catch (error) {
      this.logger.error('Error creating saga', error.stack)
      throw new HttpException('Failed to create saga', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findAll (): Promise<Saga[]> {
    try {
      return await this.sagaRepository.find()
    } catch (error) {
      this.logger.error('Error finding all sagas', error.stack)
      throw new HttpException('Failed to retrieve sagas', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findOne (id: number): Promise<Saga | null> {
    try {
      const saga = await this.sagaRepository.findOneByOrFail({ id })
      return saga
    } catch (error) {
      throw new HttpException('Saga not found', HttpStatus.NOT_FOUND)
    }
  }

  async update (id: number, updateSagaDto: UpdateSagaDto): Promise<Saga> {
    try {
      const existingSaga = await this.sagaRepository.findOneBy({ id })

      if (existingSaga == null) {
        throw new HttpException('Saga not found', HttpStatus.NOT_FOUND)
      }

      this.sagaRepository.merge(existingSaga, updateSagaDto)
      return await this.sagaRepository.save(existingSaga)
    } catch (error) {
      this.logger.error('Error updating saga', error.stack)
      if (error.status === HttpStatus.NOT_FOUND) {
        throw error
      }
      throw new HttpException('Failed to update saga', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async remove (id: number): Promise<Saga> {
    try {
      const saga = await this.sagaRepository.findOneBy({ id })

      if (saga == null) {
        throw new HttpException('Saga not found', HttpStatus.NOT_FOUND)
      }

      return await this.sagaRepository.remove(saga)
    } catch (error) {
      this.logger.error('Error removing saga', error.stack)
      if (error.status === HttpStatus.NOT_FOUND) {
        throw error
      }
      throw new HttpException('Failed to remove saga', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
