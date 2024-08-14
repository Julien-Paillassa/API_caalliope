import { ApiProperty } from '@nestjs/swagger'
import { BookPropose } from 'src/modules/book-propose/entities/book-propose.entity'
import { Book } from 'src/modules/book/entities/book.entity'
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany
} from 'typeorm'

@Entity()
export class Status {
  @ApiProperty()
  @PrimaryGeneratedColumn()
    id: number

  @ApiProperty()
  @Column()
    bookStatus: string

  @ApiProperty({ type: () => Book })
  @ManyToMany(() => Book, book => book.status)
    book: Book[]

  @ApiProperty({ type: () => BookPropose })
  @ManyToMany(() => BookPropose, bookPropose => bookPropose.status)
    bookPropose: BookPropose[]

  @ApiProperty()
  @CreateDateColumn()
    createdAt: Date

  @ApiProperty()
  @UpdateDateColumn()
    updatedAt: Date
}
