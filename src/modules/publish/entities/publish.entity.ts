import { ApiProperty } from '@nestjs/swagger'
import { Author } from 'src/modules/author/entities/author.entity'
import { Book } from 'src/modules/book/entities/book.entity'
import { Format } from 'src/modules/format/entities/format.entity'
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  ManyToOne,
  JoinColumn
} from 'typeorm'

@Entity()
export class Publish {
  @ApiProperty()
  @PrimaryGeneratedColumn()
    id: number

  @ApiProperty()
  @Column()
    price: number

  @ApiProperty()
  @Column()
    nbPages: number

  @ApiProperty({ type: () => Book })
  @OneToOne(() => Book, book => book.publish)
  @JoinColumn()
    book: Book

  @ApiProperty({ type: () => Format })
  @ManyToOne(() => Format, format => format.publish)
  @JoinColumn()
    format: Format

  @ApiProperty({ type: () => Author })
  @ManyToOne(() => Author, author => author.publish)
  @JoinColumn()
    author: Author

  @ApiProperty()
  @CreateDateColumn()
    createdAt: Date

  @ApiProperty()
  @UpdateDateColumn()
    updatedAt: Date
}
