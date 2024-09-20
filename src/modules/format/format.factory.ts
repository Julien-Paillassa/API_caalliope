import { Format } from './entities/format.entity';

export class FormatFactory {
    static createDefaultFormat(data?: Partial<Format>): Omit<Format, 'id'> {
        return {
            type: 'paper',
            language: 'Unknown Language',
            publishing: [],
            createdAt: new Date(),
            updatedAt: new Date(),
            ...data,
        };
    }
}
