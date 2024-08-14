import { ApiProperty } from '@nestjs/swagger'
import { Publish } from 'src/modules/publish/entities/publish.entity'
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

  @ApiProperty({ type: () => Publish })
  @OneToMany(() => Publish, publish => publish.format)
    publish: Publish[]

  @ApiProperty()
  @CreateDateColumn()
    createdAt: Date

  @ApiProperty()
  @UpdateDateColumn()
    updatedAt: Date
}
