import { Publishing } from './entities/publishing.entity';
import {BookFactory} from "../book/book.factory";
import {FormatFactory} from "../format/format.factory";
import {Book} from "../book/entities/book.entity";
import {Format} from "../format/entities/format.entity";
import {Status} from "../admin/entities/status.enum";

export class PublishingFactory {
    static createDefaultPublishing(data?: Partial<Publishing>): Omit<Publishing, 'id'> {
        return {
            label: 'Default Publisher',
            language: 'Unknown Language',
            isbn: '0000000000000',
            nbPages: 100,
            publicationDate: new Date().toISOString().split('T')[0],
            status: Status.WAITING,
            book: BookFactory.createDefaultBook({id: 0}) as Book,
            format: FormatFactory.createDefaultFormat({id: 0}) as Format,
            createdAt: new Date(),
            updatedAt: new Date(),
            ...data,
        };
    }
}
