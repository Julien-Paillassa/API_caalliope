import { PartialType } from '@nestjs/mapped-types';
import { CreatePublishDto } from './create-publish.dto';

export class UpdatePublishDto extends PartialType(CreatePublishDto) {}
