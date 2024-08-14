import { ApiProperty } from '@nestjs/swagger'
import { ToMakeGo } from 'src/modules/to-make-go/entities/to-make-go.entity'
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany
} from 'typeorm'

@Entity()
export class Saga {
  @ApiProperty()
  @PrimaryGeneratedColumn()
    id: number

  @ApiProperty()
  @Column()
    title: string

  @ApiProperty()
  @Column()
    description: string

  @ApiProperty()
  @Column()
    nbVolumes: number

  @ApiProperty({ type: () => ToMakeGo })
  @ManyToMany(() => ToMakeGo, toMakeGo => toMakeGo.saga)
    toMakeGo: ToMakeGo[]

  @ApiProperty()
  @CreateDateColumn()
    createdAt: Date

  @ApiProperty()
  @UpdateDateColumn()
    updatedAt: Date
}
