import { ApiProperty } from '@nestjs/swagger'
import { Avatar } from 'src/modules/avatar/entities/avatar.entity'
import { Book } from 'src/modules/book/entities/book.entity'
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  JoinColumn
} from 'typeorm'

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

  @ApiProperty({ type: () => Book })
  @OneToMany(() => Book, book => book.author)
    book: Book[]

  @ApiProperty()
  @CreateDateColumn()
    createdAt: Date

  @ApiProperty()
  @UpdateDateColumn()
    updatedAt: Date
}
