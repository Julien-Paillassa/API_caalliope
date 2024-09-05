import {Author} from "./entities/author.entity";
import {Avatar} from "../avatar/entities/avatar.entity";

export class AuthorFactory {
    static createDefaultAuthor(data?: Partial<Author>): Omit<Author, 'id'> {
        return {
            firstName: 'Unknown',
            lastName: 'Author',
            fullName: 'Unknown Author',
            email: '',
            birthDate: new Date().toISOString(),
            avatar: {} as Avatar,
            book: [],
            createdAt: new Date(),
            updatedAt: new Date(),
            ...data,
        };
    }
}
