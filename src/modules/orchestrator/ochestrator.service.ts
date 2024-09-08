import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { AuthorService } from '../author/author.service'
import { BookFactory } from '../book/book.factory'
import { BookService } from '../book/book.service'
import type { CreateBookDto } from '../book/dto/create-book.dto'
import type { Book } from '../book/entities/book.entity'
import { CoverService } from '../cover/cover.service'
import { FormatFactory } from '../format/format.factory'
import { FormatService } from '../format/format.service'
import type { CreatePublishingDto } from '../publishing/dto/create-publishing.dto'
import type { Publishing } from '../publishing/entities/publishing.entity'
import { PublishingFactory } from '../publishing/publishing.factory'
import { PublishingService } from '../publishing/publishing.service'
import type { UpdateBookDto } from '../book/dto/update-book.dto'

@Injectable()
export class OrchestratorService {
  constructor (
    @Inject(forwardRef(() => AuthorService))
    private readonly authorService: AuthorService,
    @Inject(forwardRef(() => BookService))
    private readonly bookService: BookService,
    @Inject(forwardRef(() => CoverService))
    private readonly coverService: CoverService,
    @Inject(forwardRef(() => PublishingService))
    private readonly publishingService: PublishingService,
    @Inject(forwardRef(() => FormatService))
    private readonly formatService: FormatService
  ) {}

  async createBookEntities (createBookDto: CreateBookDto): Promise<Book> {
    const authorObject = await this.authorService.createOrFindAuthor({ fullName: createBookDto.author })

    let book = await this.bookService.createBook(BookFactory.createDefaultBook({
      title: createBookDto.title,
      publicationDate: createBookDto.date,
      author: authorObject
    }))

    const format = await this.formatService.createOrFindFormat(FormatFactory.createDefaultFormat({
      type: createBookDto.format,
      language: createBookDto.language ?? 'No language provided yet'
    }))

    const publishing = await this.publishingService.createPublishing(PublishingFactory.createDefaultPublishing({
      label: createBookDto.editor,
      language: createBookDto.language ?? 'No language provided yet',
      isbn: createBookDto.isbn,
      nbPages: parseInt(createBookDto.nbPage),
      publicationDate: createBookDto.date,
      book,
      format
    }))

    book.publishing = [publishing]

    if (createBookDto.cover != null) {
      book.cover = await this.coverService.saveCover(createBookDto.cover.filename, book)
    }

    book = await this.bookService.save(book)

    return book
  }

  async createPublishingEntities (createPublishingDto: CreatePublishingDto): Promise<Publishing> {
    const format = await this.formatService.createOrFindFormat(FormatFactory.createDefaultFormat({
      type: createPublishingDto.format,
      language: createPublishingDto.language ?? 'No language provided yet'
    }))

    return await this.publishingService.createPublishing(PublishingFactory.createDefaultPublishing({
      label: createPublishingDto.editor,
      language: createPublishingDto.language ?? 'No language provided yet',
      isbn: createPublishingDto.isbn,
      nbPages: parseInt(createPublishingDto.nbPages),
      publicationDate: createPublishingDto.date,
      format
    }))
  }

  async updateBookEntities (updateBookDto: UpdateBookDto): Promise<Book | null> {
    const book = await this.bookService.findOne(updateBookDto.id)
    const author = await this.authorService.createOrFindAuthor({ fullName: updateBookDto.author ?? '' })
    if (author != null && book != null) {
      book.author = author
      return await this.bookService.save(book)
    }
    return null
  }
}
