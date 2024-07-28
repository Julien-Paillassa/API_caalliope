import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Format {
  @PrimaryGeneratedColumn()
    id: number

  @Column()
    format: string

  @Column()
    language: string

  @Column()
    createdAt: Date

  @Column()
    updatedAt: Date
}
