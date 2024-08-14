import { ApiProperty } from '@nestjs/swagger'
import { Book } from 'src/modules/book/entities/book.entity'
import { Saga } from 'src/modules/saga/entities/saga.entity'
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinTable
} from 'typeorm'

@Entity()
export class ToMakeGo {
  @ApiProperty()
  @PrimaryGeneratedColumn()
    id: number

  @ApiProperty()
  @Column()
    volumeNumber: number

  @ApiProperty({ type: () => Book })
  @ManyToMany(() => Book, book => book.toMakeGo)
  @JoinTable()
    book: Book[]

  @ApiProperty({ type: () => Saga })
  @ManyToMany(() => Saga, saga => saga.toMakeGo)
  @JoinTable()
    saga: Saga[]

  @ApiProperty()
  @CreateDateColumn()
    createdAt: Date

  @ApiProperty()
  @UpdateDateColumn()
    updatedAt: Date
}
