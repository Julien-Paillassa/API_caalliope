import { ApiProperty } from '@nestjs/swagger'
import { User } from '../../user/entities/user.entity'
import { Author } from 'src/modules/author/entities/author.entity'
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm'

@Entity()
export class UserType {
  @ApiProperty()
  @PrimaryGeneratedColumn()
    id: number

  @ApiProperty()
  @Column()
    type: string

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, user => user.userType)
  @JoinColumn()
    user: User[]

  @ApiProperty({ type: () => Author })
  @ManyToOne(() => Author, author => author.userType)
  @JoinColumn()
    author: Author[]

  @ApiProperty()
  @CreateDateColumn()
    createdAt: Date

  @ApiProperty()
  @UpdateDateColumn()
    updatedAt: Date
}
