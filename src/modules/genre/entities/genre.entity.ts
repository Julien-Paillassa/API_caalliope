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
export class Genre {
  @ApiProperty()
  @PrimaryGeneratedColumn()
    id: number

  @ApiProperty()
  @Column()
    genre: string

  @ApiProperty({ type: () => Book })
  @ManyToMany(() => Book, book => book.genre)
    book: Book[]

  @ApiProperty({ type: () => BookPropose })
  @ManyToMany(() => BookPropose, bookPropose => bookPropose.genre)
    bookPropose: BookPropose[]

  @ApiProperty()
  @CreateDateColumn()
    createdAt: Date

  @ApiProperty()
  @UpdateDateColumn()
    updatedAt: Date
}
