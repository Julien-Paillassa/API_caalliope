import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
    id: number

  @Column()
    content: string

  @Column()
    userId: number

  @Column()
    author: string

  @Column()
    createdAt: Date

  @Column()
    updatedAt: Date
}
