import { ApiProperty } from '@nestjs/swagger'
import { Book } from 'src/modules/book/entities/book.entity'
import { User } from 'src/modules/user/entities/user.entity'
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

  @ApiProperty()
  @Column()
    rating: number

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
