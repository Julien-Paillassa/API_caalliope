import { ApiProperty } from '@nestjs/swagger'
import { Avatar } from '../../avatar/entities/avatar.entity'
import { Subscription } from './../../subscription/entities/subscription.entity'
import { Possess } from './../../possess/entities/possess.entity'
import { Comment } from './../../comment/entities/comment.entity'
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  ManyToMany,
  OneToMany,
  JoinTable
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

  @ApiProperty({ type: () => Subscription })
  @ManyToMany(() => Subscription, subscription => subscription.user)
  @JoinTable()
    subscription: Subscription[]

  @ApiProperty({ type: () => Possess })
  @ManyToMany(() => Possess, possess => possess.user)
  @JoinTable()
    possess: Possess[]

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
