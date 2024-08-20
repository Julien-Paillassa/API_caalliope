import { PartialType } from '@nestjs/mapped-types';
import { CreatePossessDto } from './create-possess.dto';

export class UpdatePossessDto extends PartialType(CreatePossessDto) {}
