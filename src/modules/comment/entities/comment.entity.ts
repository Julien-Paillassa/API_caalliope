import { ApiProperty } from '@nestjs/swagger'
import { Status } from './../../admin/entities/status.enum'
import { Book } from './../../book/entities/book.entity'
import { User } from './../../user/entities/user.entity'
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm'

@Entity()
export class Comment {
  @ApiProperty()
  @PrimaryGeneratedColumn()
    id: number

  @ApiProperty()
  @Column()
    content: string

  @ApiProperty({ enum: Status, description: 'The status of the comment' })
  @Column({
    type: 'enum',
    enum: Status,
    default: Status.WAITING
  })
    status: Status

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, user => user.comment)
  @JoinColumn()
    user: User

  @ApiProperty({ type: () => Book })
  @ManyToOne(() => Book, book => book.comment)
  @JoinColumn()
    book: Book

  @ApiProperty()
  @CreateDateColumn()
    createdAt: Date

  @ApiProperty()
  @UpdateDateColumn()
    updatedAt: Date
}
