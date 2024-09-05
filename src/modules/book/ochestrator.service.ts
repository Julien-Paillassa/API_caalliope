import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { Book } from './entities/book.entity';
import {AuthorService} from "../author/author.service";
import {BookService} from "./book.service";
import {CoverService} from "../cover/cover.service";
import {PublishingService} from "../publishing/publishing.service";
import {FormatService} from "../format/format.service";
import {BookFactory} from "./book.factory";
import {FormatFactory} from "../format/format.factory";
import {PublishingFactory} from "../publishing/publishing.factory";

@Injectable()
export class OrchestratorService {
    constructor(
        private readonly authorService: AuthorService,
        private readonly bookService: BookService,
        private readonly coverService: CoverService,
        private readonly publishingService: PublishingService,
        private readonly formatService: FormatService
    ) {}

    async createBookEntities(createBookDto: CreateBookDto): Promise<Book> {
        const authorObject = await this.authorService.createOrFindAuthor({ fullName: createBookDto.author });

        let book = await this.bookService.createBook(BookFactory.createDefaultBook({
            title: createBookDto.title,
            publicationDate: createBookDto.date,
            author: authorObject
        }));

        const format = await this.formatService.createOrFindFormat(FormatFactory.createDefaultFormat({
            type: createBookDto.format,
            language: createBookDto.language || 'No language provided yet'
        }));

        const publishing = await this.publishingService.createPublishing(PublishingFactory.createDefaultPublishing({
            label: createBookDto.editor,
            language: createBookDto.language || 'No language provided yet',
            isbn: createBookDto.isbn,
            nbPages: parseInt(createBookDto.nbPage),
            publicationDate: createBookDto.date,
            book: book,
            format: format,
        }));

        book.publishing = [publishing];

        if (createBookDto.cover) {
            book.cover  = await this.coverService.saveCover(createBookDto.cover.filename, book);
        }

        book = await this.bookService.save(book);

        return book;
    }
}
