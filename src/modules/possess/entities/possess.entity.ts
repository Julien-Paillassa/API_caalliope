import { ApiProperty } from '@nestjs/swagger'
import { Book } from './../../book/entities/book.entity'
import { User } from './../../user/entities/user.entity'
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinTable
} from 'typeorm'

@Entity()
export class Possess {
  @ApiProperty()
  @PrimaryGeneratedColumn()
    id: number

  @ApiProperty({ type: () => Book })
  @ManyToMany(() => Book, book => book.possess)
  @JoinTable()
    book: Book[]

  @ApiProperty({ type: () => User })
  @ManyToMany(() => User, user => user.possess)
    user: User[]

  @ApiProperty()
  @CreateDateColumn()
    createdAt: Date

  @ApiProperty()
  @UpdateDateColumn()
    updatedAt: Date
}
