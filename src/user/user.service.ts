import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { type CreateUserDto } from './dto/create-user.dto'
import { type UpdateUserDto } from './dto/update-user.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { Repository } from 'typeorm'

@Injectable()
export class UserService {
  private readonly logger = new Logger(AbortController.name)

  constructor (
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async create (createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto)

    return await this.userRepository.save(user)
  }

  async findAll (): Promise<User[]> {
    return await this.userRepository.find()
  }

  async findOne (id: number): Promise<User | null> {
    try {
      const user = await this.userRepository.findOneByOrFail({ id })
      return user
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: 'User not found'
      }, HttpStatus.FORBIDDEN, {
        cause: error
      })
    }

    /* const user = await this.userRepository.findOneBy({ id })

    console.log(user)
    this.logger.log(user)

    if (user == null) {
      throw new HttpException('User not found', 404)
    }
    return user */
  }

  async update (id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOneBy({ id })

    if (existingUser == null) {
      throw new HttpException('User not found', 404)
    }

    const updatedUser = this.userRepository.merge(existingUser, updateUserDto)

    return await this.userRepository.save(updatedUser)
  }

  async remove (id: number): Promise<User> {
    const existingUser = await this.userRepository.findOneBy({ id })

    if (existingUser == null) {
      throw new HttpException('User not found', 404)
    }

    return await this.userRepository.remove(existingUser)
  }
}
