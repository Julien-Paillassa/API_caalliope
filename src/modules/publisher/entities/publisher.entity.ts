import { ApiProperty } from '@nestjs/swagger'
import { Book } from 'src/modules/book/entities/book.entity'
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm'

@Entity()
export class Publisher {
  @ApiProperty()
  @PrimaryGeneratedColumn()
    id: number

  @ApiProperty()
  @Column()
    name: string

  @ApiProperty({ type: () => Book })
  @OneToMany(() => Book, book => book.publisher)
    book: Book[]

  @ApiProperty()
  @CreateDateColumn()
    createdAt: Date

  @ApiProperty()
  @UpdateDateColumn()
    updatedAt: Date
}
