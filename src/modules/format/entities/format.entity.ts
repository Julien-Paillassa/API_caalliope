import { ApiProperty } from '@nestjs/swagger'
import { Publishing } from './../../publishing/entities/publishing.entity'
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm'

@Entity()
export class Format {
  @ApiProperty()
  @PrimaryGeneratedColumn()
    id: number

  @ApiProperty()
  @Column()
    type: string

  @ApiProperty()
  @Column()
    language: string

  @ApiProperty({ type: () => Publishing })
  @OneToMany(() => Publishing, publishing => publishing.format)
    publishing: Publishing[]

  @ApiProperty()
  @CreateDateColumn()
    createdAt: Date

  @ApiProperty()
  @UpdateDateColumn()
    updatedAt: Date
}
