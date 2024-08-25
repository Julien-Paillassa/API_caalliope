import { ApiProperty } from '@nestjs/swagger'
import { IsEnum } from 'class-validator'
import { Book } from 'src/modules/book/entities/book.entity'
import { User } from 'src/modules/user/entities/user.entity'
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn
} from 'typeorm'
import { UserBookStatus } from './user-book-status.enum'

@Entity()
export class UserBook {
  @ApiProperty()
  @PrimaryGeneratedColumn()
    id: number

  @ApiProperty()
  @Column({
    type: 'enum',
    enum: UserBookStatus,
    default: UserBookStatus.TO_READ
  })
  @IsEnum(UserBookStatus)
    status: UserBookStatus

  @ApiProperty({ type: () => Book })
  @ManyToOne(() => Book, book => book.userBook)
  @JoinColumn()
    book: Book

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, user => user.userBook)
  @JoinColumn()
    user: User
}
