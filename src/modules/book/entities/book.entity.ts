import { ApiProperty } from '@nestjs/swagger'
import { Author } from 'src/modules/author/entities/author.entity'
import { Comment } from 'src/modules/comment/entities/comment.entity'
import { Cover } from 'src/modules/cover/entities/cover.entity'
import { Genre } from 'src/modules/genre/entities/genre.entity'
import { Possess } from 'src/modules/possess/entities/possess.entity'
import { Publishing } from 'src/modules/publishing/entities/publishing.entity'
import { UserBook } from 'src/modules/user-book/entities/user-book.entity'
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

  @ApiProperty({ type: () => Cover })
  @OneToOne(() => Cover, cover => cover.book, { onDelete: 'CASCADE' })
  @JoinColumn()
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
  @OneToMany(() => UserBook, userBook => userBook.user)
    userBook: UserBook[]

  @ApiProperty({ type: () => Publishing })
  @OneToMany(() => Publishing, publishing => publishing.book)
    publishing: Publishing[]

  @ApiProperty({ type: () => Possess })
  @ManyToMany(() => Possess, possess => possess.book)
    possess: Possess[]

  @ApiProperty()
  @CreateDateColumn()
    createdAt: Date

  @ApiProperty()
  @UpdateDateColumn()
    updatedAt: Date
}
