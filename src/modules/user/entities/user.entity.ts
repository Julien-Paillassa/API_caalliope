import { ApiProperty } from '@nestjs/swagger'
import { Avatar } from '../../avatar/entities/avatar.entity'
import { UserType } from '../../user-type/entities/user-type.entity'
import { Subscription } from 'src/modules/subscription/entities/subscription.entity'
import { Possess } from 'src/modules/possess/entities/possess.entity'
import { Comment } from 'src/modules/comment/entities/comment.entity'
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  ManyToMany,
  OneToMany,
  JoinColumn,
  JoinTable
} from 'typeorm'
import { UserRole } from './user-role.enum'

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
  @OneToOne(() => Avatar, avatar => avatar.user, { onDelete: 'CASCADE' })
  @JoinColumn()
    avatar: Avatar

  @ApiProperty({ type: () => UserType })
  @OneToMany(() => UserType, userType => userType.user)
    userType: UserType[]

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
