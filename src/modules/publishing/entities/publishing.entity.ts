import { ApiProperty } from '@nestjs/swagger'
import { IsDate, IsNumber, IsString } from 'class-validator'
import { Status } from './../../admin/entities/status.enum'
import { Book } from './../../book/entities/book.entity'
import { Format } from './../../format/entities/format.entity'
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity()
export class Publishing {
  @ApiProperty()
  @PrimaryGeneratedColumn()
    id: number

  @ApiProperty()
  @Column()
  @IsString()
    label: string

  @ApiProperty()
  @Column()
  @IsString()
    language: string

  @ApiProperty()
  @Column()
  @IsString()
    isbn: string

  @ApiProperty()
  @Column()
  @IsNumber()
    nbPages: number

  @ApiProperty()
  @Column()
  @IsString()
    publicationDate: string

  @ApiProperty({ enum: Status, description: 'The status of the publishing' })
  @Column({
    type: 'enum',
    enum: Status,
    default: Status.WAITING
  })
    status: Status

  @ApiProperty({ type: () => Book })
  @ManyToOne(() => Book, book => book.publishing)
  @JoinColumn()
    book: Book

  @ApiProperty({ type: () => Format })
  @ManyToOne(() => Format, format => format.publishing)
  @JoinColumn()
    format: Format

  @ApiProperty()
  @CreateDateColumn()
  @IsDate()
    createdAt: Date

  @ApiProperty()
  @UpdateDateColumn()
  @IsDate()
    updatedAt: Date
}
