import { ApiProperty } from '@nestjs/swagger'
import { Book } from 'src/modules/book/entities/book.entity'
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn
} from 'typeorm'

@Entity()
export class Cover {
  @ApiProperty()
  @PrimaryGeneratedColumn()
    id: number

  @ApiProperty()
  @Column()
    filename: string

  @ApiProperty({ type: () => Book })
  @OneToOne(() => Book, book => book.cover, { onDelete: 'SET NULL', cascade: false })
  @JoinColumn()
    book: Book

  @ApiProperty()
  @CreateDateColumn()
    createdAt: Date

  @ApiProperty()
  @UpdateDateColumn()
    updatedAt: Date
}
