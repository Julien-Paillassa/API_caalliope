import { ApiProperty } from '@nestjs/swagger'
import { Author } from 'src/modules/author/entities/author.entity'
import { User } from '../../user/entities/user.entity'
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity()
export class Avatar {
  @ApiProperty()
  @PrimaryGeneratedColumn()
    id: number

  @ApiProperty()
  @Column()
    name: string

  @ApiProperty({ type: () => User })
  @OneToOne(() => User, user => user.avatar)
    user: User

  @ApiProperty({ type: () => Author })
  @OneToOne(() => Author, author => author.avatar)
    author: Author

  @ApiProperty()
  @CreateDateColumn()
    createdAt: Date

  @ApiProperty()
  @UpdateDateColumn()
    updatedAt: Date
}
