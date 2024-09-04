import { DataSource } from 'typeorm';
import { faker } from '@faker-js/faker';
import axios from 'axios'; // Importer axios pour télécharger des images
import { User } from './../modules/user/entities/user.entity';
import { Author } from './../modules/author/entities/author.entity';
import { Avatar } from './../modules/avatar/entities/avatar.entity';
import { Book } from './../modules/book/entities/book.entity';
import { Cover } from './../modules/cover/entities/cover.entity';
import { Format } from './../modules/format/entities/format.entity';
import { Genre } from './../modules/genre/entities/genre.entity';
import { Possess } from './../modules/possess/entities/possess.entity';
import { Publishing } from './../modules/publishing/entities/publishing.entity';
import { Saga } from './../modules/saga/entities/saga.entity';
import { UserBook } from './../modules/user-book/entities/user-book.entity';
import { Comment } from './../modules/comment/entities/comment.entity';
import { Subscription } from './../modules/subscription/entities/subscription.entity';
import * as bcrypt from 'bcrypt';
import { type Status } from './../modules/admin/entities/status.enum';
import { type UserBookStatus } from './../modules/user-book/entities/user-book-status.enum';
import * as fs from "node:fs";
import * as path from "node:path";

async function downloadImage(url: string, filepath: string) {
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream'
  });

  // Sauvegarder l'image sur le disque
  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(filepath);
    response.data.pipe(writer);
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

async function fixtures(): Promise<void> {
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
    });

    await dataSource.initialize();

    const userRepository = dataSource.getRepository(User);
    const authorRepository = dataSource.getRepository(Author);
    const bookRepository = dataSource.getRepository(Book);
    const formatRepository = dataSource.getRepository(Format);
    const genreRepository = dataSource.getRepository(Genre);
    const publishingRepository = dataSource.getRepository(Publishing);
    const sagaRepository = dataSource.getRepository(Saga);
    const userBookRepository = dataSource.getRepository(UserBook);
    const commentRepository = dataSource.getRepository(Comment);
    const coverRepository = dataSource.getRepository(Cover);
    const avatarRepository = dataSource.getRepository(Avatar); // Repository pour les avatars

    const password = 'azerty';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log('Lancement des fixtures.');

    // Vérifier et créer les répertoires nécessaires pour les images
    const avatarsDir = path.join(__dirname, '..', 'uploads', 'avatars');
    const coversDir = path.join(__dirname, '..', 'uploads', 'covers');

    if (!fs.existsSync(avatarsDir)) {
      fs.mkdirSync(avatarsDir, { recursive: true });
      console.log(`Répertoire des avatars créé: ${avatarsDir}`);
    }

    if (!fs.existsSync(coversDir)) {
      fs.mkdirSync(coversDir, { recursive: true });
      console.log(`Répertoire des couvertures créé: ${coversDir}`);
    }

    // Créer 100 utilisateurs avec avatars
    for (let i = 0; i < 100; i++) {
      const user = userRepository.create({
        username: faker.internet.userName(),
        lastName: faker.person.lastName(),
        firstName: faker.person.firstName(),
        email: faker.internet.email(),
        password: hashedPassword
      });

      await userRepository.save(user);
      console.log(`Utilisateur ${i + 1} créé.`);

      // Télécharger une image d'avatar pour l'utilisateur
      const avatarFilename = `avatar_${i + 1}.jpg`;
      const avatarPath = path.join(avatarsDir, avatarFilename);
      const avatarUrl = `https://avatars.dicebear.com/api/human/${i + 1}.svg`; // URL d'avatar généré
      await downloadImage(avatarUrl, avatarPath);
      console.log(`Avatar téléchargé pour l'utilisateur ${i + 1}: ${avatarFilename}`);

      // Créer une entité Avatar associée à l'utilisateur
      const avatar = avatarRepository.create({
        filename: avatarFilename,
        user: user // Associer l'avatar à l'utilisateur
      });

      await avatarRepository.save(avatar);
      console.log(`Avatar créé pour l'utilisateur ${i + 1} avec Avatar ID: ${avatar.id}.`);

      // Mettre à jour l'utilisateur avec l'entité Avatar créée
      user.avatar = avatar;
      await userRepository.save(user);
      console.log(`Utilisateur ${i + 1} mis à jour avec l'avatar ID: ${user.avatar.id}.`);
    }

    // Créer 50 auteurs
    for (let i = 0; i < 50; i++) {
      const author = authorRepository.create({
        lastName: faker.person.lastName(),
        firstName: faker.person.firstName(),
        email: faker.internet.email(),
        birthDate: faker.date.past().toISOString()
      });

      await authorRepository.save(author);
      console.log(`Auteur ${i + 1} créé.`);
    }

    // Créer 20 genres
    for (let i = 0; i < 20; i++) {
      const genre = genreRepository.create({
        genre: faker.helpers.arrayElement(['fantastic', 'sf', 'polar', 'romance', 'adventure', 'history', 'comic', 'crime', 'horror', 'biography', 'developpement', 'fantasy', 'mystery', 'science'])
      });

      await genreRepository.save(genre);
      console.log(`Genre ${i + 1} créé.`);
    }

    // Créer 200 livres avec images de couverture
    for (let i = 0; i < 200; i++) {
      const authors = await authorRepository.find();
      const genres = await genreRepository.find();
      const randomAuthor = authors[Math.floor(Math.random() * authors.length)];
      const randomGenre = genres[Math.floor(Math.random() * genres.length)];

      // Créer le livre sans couverture au départ
      const book = bookRepository.create({
        title: faker.lorem.words(),
        summary: faker.lorem.paragraph(),
        publicationDate: faker.date.past().toISOString(),
        status: faker.helpers.arrayElement(['waiting', 'accepted', 'refused']) as Status,
        author: randomAuthor,
        genre: [randomGenre],
      });

      // Sauvegarder le livre pour obtenir l'ID
      await bookRepository.save(book);
      console.log(`Livre ${i + 1} créé avec ID: ${book.id}.`);

      const coverFilename = `cover_${i + 1}.jpg`;
      const coverPath = path.join(coversDir, coverFilename);

      // Télécharger une vraie image de couverture
      const imageUrl = `https://picsum.photos/200/300?random=${i + 1}`; // URL d'image aléatoire
      await downloadImage(imageUrl, coverPath);
      console.log(`Image téléchargée pour le livre ${i + 1}: ${coverFilename}`);

      // Créer une couverture associée au livre
      const cover = coverRepository.create({
        filename: coverFilename,
        book: book, // Associer le livre à cette couverture
      });

      // Sauvegarder la couverture
      await coverRepository.save(cover);
      console.log(`Couverture créée pour le livre ${i + 1} avec Cover ID: ${cover.id}.`);

      // Mettre à jour le champ cover du livre avec l'entité Cover créée
      book.cover = cover;
      await bookRepository.save(book);
      console.log(`Livre ${i + 1} mis à jour avec la couverture ID: ${book.cover.id}.`);
    }

    // Créer 30 formats
    for (let i = 0; i < 30; i++) {
      const format = formatRepository.create({
        type: faker.lorem.word(),
        language: faker.lorem.word()
      });

      await formatRepository.save(format);
      console.log(`Format ${i + 1} créé.`);
    }

    // Créer 50 publications
    for (let i = 0; i < 50; i++) {
      const books = await bookRepository.find();
      const formats = await formatRepository.find();

      const randomBook = books[Math.floor(Math.random() * books.length)];
      const randomFormat = formats[Math.floor(Math.random() * formats.length)];

      const publishing = publishingRepository.create({
        label: faker.company.buzzVerb(),
        language: faker.lorem.word(),
        isbn: `978-${faker.number.int({ min: 1000000000000, max: 9999999999999 })}`,
        nbPages: faker.number.int({ min: 100, max: 300 }),
        publicationDate: faker.date.past().toISOString(),
        status: faker.helpers.arrayElement(['waiting', 'accepted', 'refused']) as Status,
        book: randomBook,
        format: randomFormat
      });

      await publishingRepository.save(publishing);
      console.log(`Publishing ${i + 1} créé.`);
    }

    // Créer 20 sagas
    for (let i = 0; i < 20; i++) {
      const saga = sagaRepository.create({
        title: faker.lorem.words(),
        description: faker.lorem.paragraph(),
        nbVolumes: faker.number.int({ min: 1, max: 5 })
      });

      await sagaRepository.save(saga);
      console.log(`Saga ${i + 1} créée.`);
    }

    // Créer 100 associations utilisateur-livre
    for (let i = 0; i < 100; i++) {
      const users = await userRepository.find();
      const books = await bookRepository.find();
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomBook = books[Math.floor(Math.random() * books.length)];

      const userBook = userBookRepository.create({
        user: randomUser,
        book: randomBook,
        status: faker.helpers.arrayElement(['read', 'toRead', 'abandoned', 'reading', 'wishlist']) as UserBookStatus
      });

      await userBookRepository.save(userBook);
      console.log(`UserBook ${i + 1} créé.`);
    }

    // Créer 200 commentaires
    for (let i = 0; i < 200; i++) {
      const users = await userRepository.find();
      const books = await bookRepository.find();

      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomBook = books[Math.floor(Math.random() * books.length)];

      const comment = commentRepository.create({
        content: faker.lorem.paragraph(),
        rating: faker.number.int({ min: 1, max: 5 }),
        status: faker.helpers.arrayElement(['waiting', 'accepted', 'refused']) as Status,
        user: randomUser,
        book: randomBook
      });

      await commentRepository.save(comment);
      console.log(`Commentaire ${i + 1} créé.`);
    }

    await dataSource.destroy();
    console.log('Fixtures terminées.');
  } catch (error) {
    console.error('Erreur lors du seeding :', error);
  }
}

fixtures().catch((error) => {
  console.error("Erreur inattendue lors de l'exécution du script de seeding :", error);
  process.exit(1);
});
