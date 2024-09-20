import { ApiProperty } from '@nestjs/swagger'
import { Avatar } from '../../avatar/entities/avatar.entity'
import { Comment } from './../../comment/entities/comment.entity'
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany
} from 'typeorm'
import { UserRole } from './user-role.enum'
import { UserBook } from './../../user-book/entities/user-book.entity'

@Entity()
export class User {
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
  @Column()
    password: string

  @ApiProperty()
  @Column()
    email: string

  @ApiProperty()
  @Column()
    username: string

  @ApiProperty({ enum: UserRole, description: 'The role of the user' })
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER
  })
    role: UserRole

  @ApiProperty({ type: () => Avatar })
  @OneToOne(() => Avatar, avatar => avatar.user, { cascade: false, onDelete: 'SET NULL' })
    avatar: Avatar

  @ApiProperty({ type: () => UserBook })
  @OneToMany(() => UserBook, userBook => userBook.user)
    userBook: UserBook[]

  @ApiProperty({ type: () => Comment })
  @OneToMany(() => Comment, comment => comment.user)
    comment: Comment[]

  @ApiProperty()
  @CreateDateColumn()
    createdAt: Date

  @ApiProperty()
  @UpdateDateColumn()
    updatedAt: Date
}
