import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import axios from 'axios'
import { Book } from '../book/entities/book.entity'
import { Author } from '../author/entities/author.entity'
import { Genre } from '../genre/entities/genre.entity'
import { Publishing } from '../publishing/entities/publishing.entity'
import { Format } from '../format/entities/format.entity'

interface GoogleBook {
  volumeInfo: {
    title: string
    authors: string[]
    publisher?: string
    publishedDate?: string
    description?: string
    industryIdentifiers?: Array<{
      type: string
      identifier: string
    }>
    pageCount?: number
    printType?: string
    categories?: string[]
    averageRating: number
    ratingsCount: number
    language?: string
  }
}

@Injectable()
export class GoogleBookService {
  private readonly googleBooksApiUrl = 'https://www.googleapis.com/books/v1/volumes'

  constructor (
    @InjectRepository(Book)
    private readonly booksRepository: Repository<Book>,
    @InjectRepository(Author)
    private readonly authorsRepository: Repository<Author>,
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
    @InjectRepository(Format)
    private readonly formatRepository: Repository<Format>,
    @InjectRepository(Publishing)
    private readonly publishingRepository: Repository<Publishing>
  ) {}

  async fetchBooks (query: string): Promise<GoogleBook[]> {
    const books: GoogleBook[] = []
    const maxResults = 40

    try {
      let response = await axios.get<{ items: GoogleBook[] }>(`${this.googleBooksApiUrl}?q=${query}&maxResults=${maxResults}`)
      books.push(...(response.data.items ?? []))

      if (books.length < 50) {
        const remainingResults = 50 - books.length
        response = await axios.get<{ items: GoogleBook[] }>(`${this.googleBooksApiUrl}?q=${query}&startIndex=${maxResults}&maxResults=${remainingResults}`)
        books.push(...(response.data.items ?? []))
      }

      return books
    } catch (error) {
      throw new HttpException('Failed to fetch books', HttpStatus.BAD_REQUEST)
    }
  }

  async saveBooksToDatabase (books: GoogleBook[]): Promise<void> {
    for (const googleBook of books) {
      // Vérifier si l'auteur existe déjà
      const authorName = Array.isArray(googleBook.volumeInfo.authors) && googleBook.volumeInfo.authors.length > 0
        ? googleBook.volumeInfo.authors[0]
        : 'Unknown Author'

      let author = await this.authorsRepository.findOne({ where: { lastName: authorName } })

      if (author === null || author === undefined) {
        // Si l'auteur n'existe pas, créer un nouvel auteur
        author = this.authorsRepository.create({
          firstName: 'Unknown', // Par défaut si non fourni
          lastName: authorName
        })
        await this.authorsRepository.save(author)
      }

      // Vérifier si le genre existe déjà et le créer si nécessaire
      const genreNames = googleBook.volumeInfo.categories ?? ['Unknown Genre']
      const genres: Genre[] = []

      for (const genreName of genreNames) {
        let genre = await this.genreRepository.findOne({ where: { genre: genreName } })
        if (genre === null || genre === undefined) {
          genre = this.genreRepository.create({ genre: genreName })
          await this.genreRepository.save(genre)
        }
        genres.push(genre)
      }

      // Créer un nouveau livre
      const newBook = this.booksRepository.create({
        title: googleBook.volumeInfo.title,
        summary: googleBook.volumeInfo.description ?? 'No description available',
        publicationDate: googleBook.volumeInfo.publishedDate ?? 'Unknown',
        author, // Relation avec l'auteur
        genre: genres // Relation avec les genres
        // Ajoute les autres propriétés du livre ici
      })

      const formatType = googleBook.volumeInfo.printType ?? 'Unknown Format'
      let format = await this.formatRepository.findOne({ where: { type: formatType } })
      if (format === null || format === undefined) {
        format = this.formatRepository.create({ type: formatType, language: googleBook.volumeInfo.language ?? 'Unknown' })
        await this.formatRepository.save(format)
      }

      // Créer et sauvegarder le publishing
      const isbn = Array.isArray(googleBook.volumeInfo.industryIdentifiers) && googleBook.volumeInfo.industryIdentifiers.length > 0
        ? googleBook.volumeInfo.industryIdentifiers[0].identifier
        : 'Unknown ISBN'

      const publishing = this.publishingRepository.create({
        label: googleBook.volumeInfo.publisher ?? 'Unknown Publisher',
        language: googleBook.volumeInfo.language ?? 'Unknown Language',
        isbn,
        nbPages: googleBook.volumeInfo.pageCount ?? 0,
        publicationDate: googleBook.volumeInfo.publishedDate ?? 'Unknown',
        format, // Relation avec le format
        book: newBook // Relation avec le livre
      })
      await this.publishingRepository.save(publishing)
      // Sauvegarder le nouveau livre dans la base de données
      await this.booksRepository.save(newBook)
    }
  }
}
