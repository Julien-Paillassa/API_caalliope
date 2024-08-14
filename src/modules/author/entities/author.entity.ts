import { ApiProperty } from '@nestjs/swagger'
import { Avatar } from 'src/modules/avatar/entities/avatar.entity'
import { UserType } from 'src/modules/user-type/entities/user-type.entity'
import { Book } from 'src/modules/book/entities/book.entity'
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  ManyToOne,
  JoinColumn
} from 'typeorm'
import { Publish } from 'src/modules/publish/entities/publish.entity'
import { BookPropose } from 'src/modules/book-propose/entities/book-propose.entity'

@Entity()
export class Author {
  @ApiProperty()
  @PrimaryGeneratedColumn()
    id: number

  @ApiProperty()
  @Column()
    firstName: string

  @ApiProperty()
  @Column()
    lastName: string

  @ApiProperty({ type: () => Avatar })
  @OneToOne(() => Avatar, avatar => avatar.author, { onDelete: 'CASCADE' })
  @JoinColumn()
    avatar: Avatar

  @ApiProperty()
  @Column()
    email: string

  @ApiProperty()
  @Column()
    birthDate: string

  @ApiProperty({ type: () => UserType })
  @ManyToOne(() => UserType, userType => userType.author)
  @JoinColumn()
    userType: UserType

  @ApiProperty({ type: () => Book })
  @OneToMany(() => Book, book => book.author)
    book: Book[]

  @ApiProperty({ type: () => BookPropose })
  @OneToMany(() => BookPropose, bookPropose => bookPropose.author)
    bookPropose: BookPropose[]

  @ApiProperty({ type: () => Publish })
  @OneToMany(() => Publish, publish => publish.author)
    publish: Publish[]

  @ApiProperty()
  @CreateDateColumn()
    createdAt: Date

  @ApiProperty()
  @UpdateDateColumn()
    updatedAt: Date
}
