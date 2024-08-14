import { PartialType } from '@nestjs/mapped-types';
import { CreateToMakeGoDto } from './create-to-make-go.dto';

export class UpdateToMakeGoDto extends PartialType(CreateToMakeGoDto) {}
