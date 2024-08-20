import { ApiProperty } from '@nestjs/swagger'
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

  @ApiProperty()
  @CreateDateColumn()
    createdAt: Date

  @ApiProperty()
  @UpdateDateColumn()
    updatedAt: Date
}
