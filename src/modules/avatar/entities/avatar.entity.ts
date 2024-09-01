import { ApiProperty } from '@nestjs/swagger'
import { Author } from './../../author/entities/author.entity'
import { User } from '../../user/entities/user.entity'
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn
} from 'typeorm'

@Entity()
export class Avatar {
  @ApiProperty()
  @PrimaryGeneratedColumn()
    id: number

  @ApiProperty()
  @Column()
    filename: string

  @ApiProperty({ type: () => User })
  @OneToOne(() => User, user => user.avatar, { onDelete: 'SET NULL', cascade: false })
  @JoinColumn()
    user: User

  @ApiProperty({ type: () => Author })
  @OneToOne(() => Author, author => author.avatar, { onDelete: 'SET NULL', cascade: false })
  @JoinColumn()
    author: Author

  @ApiProperty()
  @CreateDateColumn()
    createdAt: Date

  @ApiProperty()
  @UpdateDateColumn()
    updatedAt: Date
}
