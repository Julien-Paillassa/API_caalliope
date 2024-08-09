import { ApiProperty } from '@nestjs/swagger'
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'

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

  @ApiProperty()
  @CreateDateColumn()
    createdAt: Date

  @ApiProperty()
  @UpdateDateColumn()
    updatedAt: Date
}
