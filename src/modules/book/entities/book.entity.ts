import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
    id: number

  @Column()
    title: string

  @Column()
    ibsn: string

  @Column()
    cover: string

  @Column()
    status: string

  @Column()
    publisher: string

  @Column()
    sagaId: number

  @Column()
    publishedAt: Date

  @Column()
    createdAt: Date

  @Column()
    updatedAt: Date
}
