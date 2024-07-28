import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Author {
  @PrimaryGeneratedColumn()
    id: number

  @Column()
    firstName: string

  @Column()
    lastName: string

  @Column()
    createdAt: Date

  @Column()
    updatedAt: Date
}
