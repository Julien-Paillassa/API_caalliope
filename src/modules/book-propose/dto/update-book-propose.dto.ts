import { PartialType } from '@nestjs/mapped-types';
import { CreateBookProposeDto } from './create-book-propose.dto';

export class UpdateBookProposeDto extends PartialType(CreateBookProposeDto) {}
