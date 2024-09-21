import { type Book } from './entities/book.entity'
import { type Cover } from '../cover/entities/cover.entity'
import { Status } from '../admin/entities/status.enum'
import { Author } from '../author/entities/author.entity'

export const BookFactory = {
  createDefaultBook (data?: Partial<Book>): Omit<Book, 'id'> {
    return {
      title: 'Default Title',
      summary: 'No summary for this book yet',
      publicationDate: new Date().toISOString().split('T')[0],
      status: Status.WAITING,
      rating: 0,
      cover: {} as Cover,
      author: new Author(),
      comment: [],
      genre: [],
      userBook: [],
      publishing: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data
    }
  }
}
