import { ApiProperty } from '@nestjs/swagger'
import { BookPropose } from 'src/modules/book-propose/entities/book-propose.entity'
import { Book } from 'src/modules/book/entities/book.entity'
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity()
export class Cover {
  @ApiProperty()
  @PrimaryGeneratedColumn()
    id: number

  @ApiProperty()
  @Column()
    name: string

  @ApiProperty({ type: () => Book })
  @OneToOne(() => Book, book => book.cover)
    book: Book

  @ApiProperty({ type: () => BookPropose })
  @OneToOne(() => BookPropose, bookPropose => bookPropose.cover)
    bookPropose: BookPropose

  @ApiProperty()
  @CreateDateColumn()
    createdAt: Date

  @ApiProperty()
  @UpdateDateColumn()
    updatedAt: Date
}
