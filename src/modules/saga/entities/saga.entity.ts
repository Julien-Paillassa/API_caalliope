import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Saga {
  @PrimaryGeneratedColumn()
    id: number

  @Column()
    title: string

  @Column()
    description: string

  @Column()
    nbVolumes: number

  @Column()
    createdAt: Date

  @Column()
    updatedAt: Date
}
