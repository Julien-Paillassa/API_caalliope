import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import axios from 'axios'
import { Book } from '../book/entities/book.entity'
import { Author } from '../author/entities/author.entity'
import { Genre } from '../genre/entities/genre.entity'
import { Publishing } from '../publishing/entities/publishing.entity'
import { Format } from '../format/entities/format.entity'
import { Status } from '../admin/entities/status.enum'
import { Cover } from '../cover/entities/cover.entity'

export interface GoogleBook {
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
    imageLinks?: {
      smallThumbnail?: string
      thumbnail?: string
    }
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
    private readonly publishingRepository: Repository<Publishing>,
    @InjectRepository(Cover)
    private readonly coverRepository: Repository<Cover>
  ) { }

  /* async onModuleInit (): Promise<void> {
    const defaultQuery = 'programming'
    try {
      console.log(`Fetching and saving books for query: ${defaultQuery}`)
      const books = await this.fetchBooks(defaultQuery)
      await this.saveBooksToDatabase(books)
      console.log('Successfully imported books during initialization.')
    } catch (error) {
      console.error('Failed to import books during initialization:', error)
    }
  } */

  async fetchBooks (query: string): Promise<GoogleBook[]> {
    const books: GoogleBook[] = []
    const maxResults = 40
    const totalBooksToFetch = 150

    try {
      // Première requête pour récupérer un maximum de 40 livres
      let response = await axios.get<{ items: GoogleBook[] }>(`${this.googleBooksApiUrl}?q=${query}&maxResults=${maxResults}`)
      books.push(...(response.data.items ?? []))

      // Si on n'a pas encore récupéré 100 livres, faire des requêtes supplémentaires
      while (books.length < totalBooksToFetch) {
        const remainingResults = totalBooksToFetch - books.length
        const startIndex = books.length

        response = await axios.get<{ items: GoogleBook[] }>(`${this.googleBooksApiUrl}?q=${query}&startIndex=${startIndex}&maxResults=${Math.min(maxResults, remainingResults)}`)
        books.push(...(response.data.items ?? []))

        if ((response.data.items ?? []).length === 0) {
          break
        }
      }

      return books
    } catch (error) {
      throw new HttpException('Failed to fetch books', HttpStatus.BAD_REQUEST)
    }
  }

  private mapGenre (genre: string): string {
    switch (genre) {
      case 'Mathematics':
      case 'Business & Economics':
      case 'Psychology':
      case 'Biology':
      case 'Medical':
      case 'Language Arts & Disciplines':
        return 'Education'

      case 'Technology & Engineering':
      case 'Big data':
      case 'Computer programming':
      case 'Programming languages (Electronic computers)':
      case 'Prolog (Computer program language)':
      case 'Clojure (Computer program language)':
      case 'Java (Computer program language)':
      case 'Application software':
      case 'Operations research':
        return 'Computers'

      default:
        return genre
    }
  }

  async saveBooksToDatabase (books: GoogleBook[]): Promise<void> {
    for (const googleBook of books) {
      const authorName = Array.isArray(googleBook.volumeInfo.authors) && googleBook.volumeInfo.authors.length > 0
        ? googleBook.volumeInfo.authors[0]
        : 'Unknown Author'

      const [firstName, ...lastNameParts] = authorName.split(' ')
      const lastName = lastNameParts.length > 0 ? lastNameParts.join(' ') : 'Unknown'

      // Rechercher l'auteur dans la base de données par son nom de famille
      let author = await this.authorsRepository.findOne({ where: { lastName } })

      if (author === null || author === undefined) {
        // Si l'auteur n'existe pas, créer un nouvel auteur
        author = this.authorsRepository.create({
          firstName: typeof firstName === 'string' && firstName.trim() !== '' ? firstName : 'Unknown',
          lastName,
          avatar: undefined,
          email: 'Unknown Email',
          birthDate: 'Unknown Birth Date'
        })
        await this.authorsRepository.save(author)
      }

      // Vérifier si le genre existe déjà et le créer si nécessaire
      const genreNames = googleBook.volumeInfo.categories

      // Si les genres ne sont pas définis, passer au livre suivant
      if (genreNames === null || genreNames === undefined) {
        // console.log(`Skipping book: ${googleBook.volumeInfo.title} due to missing genres`)
        continue
      }

      const genres: Genre[] = []

      for (let genreName of genreNames) {
        genreName = this.mapGenre(genreName)

        let genre = await this.genreRepository.findOne({ where: { genre: genreName } })
        if (genre === null || genre === undefined) {
          genre = this.genreRepository.create({ genre: genreName })
          await this.genreRepository.save(genre)
        }
        genres.push(genre)
      }

      // Logique pour la couverture
      let cover: Cover | null = null
      const coverUrl = (googleBook.volumeInfo.imageLinks != null) && typeof googleBook.volumeInfo.imageLinks.thumbnail === 'string'
        ? googleBook.volumeInfo.imageLinks.thumbnail
        : null

      if (coverUrl != null) {
        cover = this.coverRepository.create({
          filename: coverUrl
        })
        await this.coverRepository.save(cover)
      }

      const formatType = googleBook.volumeInfo.printType ?? 'Unknown Format'
      let format = await this.formatRepository.findOne({ where: { type: formatType } })
      if (format === null || format === undefined) {
        format = this.formatRepository.create({
          type: formatType,
          language: googleBook.volumeInfo.language ?? 'Unknown'
        })
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
        format
      })
      await this.publishingRepository.save(publishing)

      // Créer un nouveau livre
      const newBook = this.booksRepository.create({
        title: googleBook.volumeInfo.title,
        summary: googleBook.volumeInfo.description ?? 'No description available',
        publicationDate: googleBook.volumeInfo.publishedDate ?? 'Unknown',
        status: Status.ACCEPTED,
        rating: Math.floor(Math.random() * 6),
        ratingNumber: Math.floor(Math.random() * 6),
        author,
        cover: cover ?? undefined,
        genre: genres,
        publishing: [publishing]
      })
      // console.log('new book : ', newBook)
      // Sauvegarder le nouveau livre dans la base de données
      await this.booksRepository.save(newBook)
    }
  }
}
