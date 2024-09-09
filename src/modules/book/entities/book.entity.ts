import { ApiProperty } from '@nestjs/swagger'
import { Status } from './../../admin/entities/status.enum'
import { Author } from './../../author/entities/author.entity'
import { Comment } from './../../comment/entities/comment.entity'
import { Cover } from './../../cover/entities/cover.entity'
import { Genre } from './../../genre/entities/genre.entity'
import { Publishing } from './../../publishing/entities/publishing.entity'
import { UserBook } from './../../user-book/entities/user-book.entity'
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  ManyToOne,
  ManyToMany,
  OneToMany,
  JoinColumn,
  JoinTable
} from 'typeorm'

@Entity()
export class Book {
  @ApiProperty()
  @PrimaryGeneratedColumn()
    id: number

  @ApiProperty()
  @Column()
    title: string

  @ApiProperty()
  @Column()
    summary: string

  @ApiProperty()
  @Column()
    publicationDate: string

  @ApiProperty({ enum: Status, description: 'The status of the book' })
  @Column({
    type: 'enum',
    enum: Status,
    default: Status.WAITING
  })
    status: Status

  @ApiProperty({ type: () => Cover })
  @OneToOne(() => Cover, cover => cover.book, { cascade: false, onDelete: 'SET NULL' })
    cover: Cover

  @ApiProperty({ type: () => Author })
  @ManyToOne(() => Author, author => author.book)
  @JoinColumn()
    author: Author

  @ApiProperty({ type: () => Comment })
  @OneToMany(() => Comment, comment => comment.book)
    comment: Comment[]

  @ApiProperty({ type: () => Genre })
  @ManyToMany(() => Genre, genre => genre.book)
  @JoinTable()
    genre: Genre[]

  @ApiProperty({ type: () => UserBook })
  @OneToMany(() => UserBook, userBook => userBook.book)
    userBook: UserBook[]

  @ApiProperty({ type: () => Publishing })
  @OneToMany(() => Publishing, publishing => publishing.book)
    publishing: Publishing[]

  @ApiProperty()
  @CreateDateColumn()
    createdAt: Date

  @ApiProperty()
  @UpdateDateColumn()
    updatedAt: Date
}
