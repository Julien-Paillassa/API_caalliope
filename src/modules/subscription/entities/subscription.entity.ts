import { ApiProperty } from '@nestjs/swagger'
import { User } from './../../user/entities/user.entity'
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany
} from 'typeorm'

@Entity()
export class Subscription {
  @ApiProperty()
  @PrimaryGeneratedColumn()
    id: number

  @ApiProperty()
  @Column()
    type: string

  @ApiProperty({ type: () => User })
  @ManyToMany(() => User, user => user.subscription)
    user: User[]

  @ApiProperty()
  @CreateDateColumn()
    createdAt: Date

  @ApiProperty()
  @UpdateDateColumn()
    updatedAt: Date
}
