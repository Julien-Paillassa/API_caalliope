import { DataSource } from 'typeorm'
import { faker } from '@faker-js/faker'
import { User } from './../modules/user/entities/user.entity'
import { Author } from './../modules/author/entities/author.entity'
import { Avatar } from './../modules/avatar/entities/avatar.entity'
import { Book } from './../modules/book/entities/book.entity'
import { Cover } from './../modules/cover/entities/cover.entity'
import { Format } from './../modules/format/entities/format.entity'
import { Genre } from './../modules/genre/entities/genre.entity'
import { Possess } from './../modules/possess/entities/possess.entity'
import { Publishing } from './../modules/publishing/entities/publishing.entity'
import { Saga } from './../modules/saga/entities/saga.entity'
import { UserBook } from './../modules/user-book/entities/user-book.entity'
import { Comment } from './../modules/comment/entities/comment.entity'
import { Subscription } from './../modules/subscription/entities/subscription.entity'
import * as bcrypt from 'bcrypt'
import { type Status } from './../modules/admin/entities/status.enum'
import { type UserBookStatus } from './../modules/user-book/entities/user-book-status.enum'

async function fixtures (): Promise<void> {
  try {
    const dataSource = new DataSource({
      type: 'postgres',
      host: 'db',
      port: 5432,
      username: 'caaliope',
      password: 'caaliope_dev*2024!',
      database: 'database_caaliope_dev',
      entities: [
        User,
        Saga,
        Format,
        Comment,
        Book,
        Author,
        Avatar,
        Subscription,
        Possess,
        Cover,
        Genre,
        Publishing,
        UserBook
      ],
      synchronize: true
    })

    await dataSource.initialize()

    const userRepository = dataSource.getRepository(User)
    const authorRepository = dataSource.getRepository(Author)
    const bookRepository = dataSource.getRepository(Book)
    const formatRepository = dataSource.getRepository(Format)
    const genreRepository = dataSource.getRepository(Genre)
    const publishingRepository = dataSource.getRepository(Publishing)
    const sagaRepository = dataSource.getRepository(Saga)
    const userBookRepository = dataSource.getRepository(UserBook)
    const commentRepository = dataSource.getRepository(Comment)

    const password = 'azerty'
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    console.log('Lancement des fixtures.')

    for (let i = 0; i < 10; i++) {
      const user = userRepository.create({
        username: faker.internet.userName(),
        lastName: faker.person.lastName(),
        firstName: faker.person.firstName(),
        email: faker.internet.email(),
        password: hashedPassword
      })

      await userRepository.save(user)
      console.log(`Utilisateur ${i + 1} créé.`)
    }

    for (let i = 0; i < 10; i++) {
      const author = authorRepository.create({
        lastName: faker.person.lastName(),
        firstName: faker.person.firstName(),
        email: faker.internet.email(),
        birthDate: faker.date.past().toISOString()
      })

      await authorRepository.save(author)
      console.log(`Auteur ${i + 1} créé.`)
    }

    for (let i = 0; i < 10; i++) {
      const genre = genreRepository.create({
        genre: faker.helpers.arrayElement(['fantastic', 'science-fiction', 'polar', 'romance', 'adventure', 'historical', 'comic'])
      })

      await genreRepository.save(genre)
      console.log(`Genre ${i + 1} créé.`)
    }

    for (let i = 0; i < 10; i++) {
      const author = await authorRepository.find()
      const genre = await genreRepository.find()
      const randomAuthor = author[Math.floor(Math.random() * author.length)]
      const randomGenre = genre[Math.floor(Math.random() * genre.length)]

      const book = bookRepository.create({
        title: faker.lorem.words(),
        summary: faker.lorem.paragraph(),
        publicationDate: faker.date.past().toISOString(),
        status: faker.helpers.arrayElement(['waiting', 'accepted', 'refused']) as Status,
        author: randomAuthor,
        genre: [randomGenre]
      })

      await bookRepository.save(book)
      console.log(`Livre ${i + 1} créé.`)
    }

    for (let i = 0; i < 10; i++) {
      const format = formatRepository.create({
        type: faker.lorem.word(),
        language: faker.lorem.word()
      })

      await formatRepository.save(format)
      console.log(`Format ${i + 1} créé.`)
    }

    for (let i = 0; i < 10; i++) {
      const book = await bookRepository.find()
      const format = await formatRepository.find()

      const randomBook = book[Math.floor(Math.random() * book.length)]
      const randomFormat = format[Math.floor(Math.random() * format.length)]

      const publishing = publishingRepository.create({
        label: faker.company.buzzVerb(),
        language: faker.lorem.word(),
        isbn: '9782070423201',
        nbPages: faker.number.int({ min: 100, max: 300 }),
        publicationDate: faker.date.past().toISOString(),
        status: faker.helpers.arrayElement(['waiting', 'accepted', 'refused']) as Status,
        book: randomBook,
        format: randomFormat
      })

      await publishingRepository.save(publishing)
      console.log(`Publishing ${i + 1} créé.`)
    }

    for (let i = 0; i < 10; i++) {
      const saga = sagaRepository.create({
        title: faker.lorem.words(),
        description: faker.lorem.paragraph(),
        nbVolumes: faker.number.int({ min: 1, max: 5 })
      })

      await sagaRepository.save(saga)
      console.log(`Saga ${i + 1} créé.`)
    }

    for (let i = 0; i < 10; i++) {
      const users = await userRepository.find()
      const books = await bookRepository.find()
      const randomUser = users[Math.floor(Math.random() * users.length)]
      const randomBook = books[Math.floor(Math.random() * books.length)]

      const userBook = userBookRepository.create({
        user: randomUser,
        book: randomBook,
        status: faker.helpers.arrayElement(['read', 'toRead', 'abandoned', 'reading', 'wishlist']) as UserBookStatus
      })

      await userBookRepository.save(userBook)
      console.log(`UserBook ${i + 1} créé.`)
    }

    for (let i = 0; i < 10; i++) {
      const users = await userRepository.find()
      const books = await bookRepository.find()

      const randomUser = users[Math.floor(Math.random() * users.length)]
      const randomBook = books[Math.floor(Math.random() * books.length)]

      const comment = commentRepository.create({
        content: faker.lorem.paragraph(),
        rating: faker.number.int({ min: 1, max: 5 }),
        status: faker.helpers.arrayElement(['waiting', 'accepted', 'refused']) as Status,
        user: randomUser,
        book: randomBook
      })

      await commentRepository.save(comment)
      console.log(`Comment ${i + 1} créé.`)
    }

    await dataSource.destroy()
    console.log('Fixtures terminées.')
  } catch (error) {
    console.error('Erreur lors du seeding :', error)
  }
}

fixtures().catch((error) => {
  console.error("Erreur inattendue lors de l'exécution du script de seeding :", error)
  process.exit(1)
})
