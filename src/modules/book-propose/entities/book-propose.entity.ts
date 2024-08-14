import { ApiProperty } from '@nestjs/swagger'
import { Author } from 'src/modules/author/entities/author.entity'
import { Cover } from 'src/modules/cover/entities/cover.entity'
import { Genre } from 'src/modules/genre/entities/genre.entity'
import { Status } from 'src/modules/status/entities/status.entity'
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  JoinTable
} from 'typeorm'

@Entity()
export class BookPropose {
  @ApiProperty()
  @PrimaryGeneratedColumn()
    id: number

  @ApiProperty()
  @Column()
    title: string

  @ApiProperty()
  @Column()
    ibsn: string

  @ApiProperty()
  @Column()
    publicationDate: string

  @ApiProperty({ type: () => Cover })
  @OneToOne(() => Cover, cover => cover.bookPropose, { onDelete: 'CASCADE' })
    cover: Cover

  @ApiProperty({ type: () => Author })
  @ManyToOne(() => Author, author => author.bookPropose)
  @JoinColumn()
    author: Author

  @ApiProperty({ type: () => Status })
  @ManyToMany(() => Status, status => status.bookPropose)
  @JoinColumn()
    status: Status[]

  @ApiProperty({ type: () => Genre })
  @ManyToMany(() => Genre, genre => genre.bookPropose)
  @JoinTable()
    genre: Genre[]

  @ApiProperty()
  @CreateDateColumn()
    createdAt: Date

  @ApiProperty()
  @UpdateDateColumn()
    updatedAt: Date
}
