import { ApiProperty } from '@nestjs/swagger'
import { Author } from 'src/modules/author/entities/author.entity'
import { Comment } from 'src/modules/comment/entities/comment.entity'
import { Cover } from 'src/modules/cover/entities/cover.entity'
import { Genre } from 'src/modules/genre/entities/genre.entity'
import { Possess } from 'src/modules/possess/entities/possess.entity'
import { Publish } from 'src/modules/publish/entities/publish.entity'
import { Publisher } from 'src/modules/publisher/entities/publisher.entity'
import { Status } from 'src/modules/status/entities/status.entity'
import { ToMakeGo } from 'src/modules/to-make-go/entities/to-make-go.entity'
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

  @ApiProperty({ type: () => Status })
  @ManyToMany(() => Status, status => status.book)
  @JoinTable()
    status: Status[]

  @ApiProperty({ type: () => Comment })
  @OneToMany(() => Comment, comment => comment.book)
    comment: Comment[]

  @ApiProperty({ type: () => Genre })
  @ManyToMany(() => Genre, genre => genre.book)
  @JoinTable()
    genre: Genre[]

  @ApiProperty({ type: () => Publisher })
  @ManyToOne(() => Publisher, publisher => publisher.book)
  @JoinColumn()
    publisher: Publisher

  @ApiProperty({ type: () => Possess })
  @ManyToMany(() => Possess, possess => possess.book)
    possess: Possess[]

  @ApiProperty({ type: () => Publish })
  @OneToOne(() => Publish, publish => publish.book)
    publish: Publish

  @ApiProperty({ type: () => ToMakeGo })
  @ManyToMany(() => ToMakeGo, toMakeGo => toMakeGo.book)
    toMakeGo: ToMakeGo[]

  @ApiProperty()
  @CreateDateColumn()
    createdAt: Date

  @ApiProperty()
  @UpdateDateColumn()
    updatedAt: Date
}
