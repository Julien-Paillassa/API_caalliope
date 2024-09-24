import { ApiProperty } from '@nestjs/swagger'
import { Avatar } from './../../avatar/entities/avatar.entity'
import { Book } from './../../book/entities/book.entity'
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany
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

  @ApiProperty()
  @Column({ nullable: true })
    fullName: string

  @ApiProperty({ type: () => Avatar })
  @OneToOne(() => Avatar, avatar => avatar.author, { cascade: false, onDelete: 'SET NULL' })
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
