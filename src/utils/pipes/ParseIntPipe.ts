import { type PipeTransform, Injectable, BadRequestException } from '@nestjs/common'

@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
  transform (value: string): number {
    const parsedValue = parseInt(value, 10)
    if (isNaN(parsedValue)) {
      throw new BadRequestException('Validation failed (numeric string is expected)')
    }
    return parsedValue
  }
}
