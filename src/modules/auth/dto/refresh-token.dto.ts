import { IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class RefreshTokenDto {
  @ApiProperty({
    description: 'Token of the user',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEwMSwiZW1haWwiOiJqb2huLmRvZUBleGFtcGxlLmNvbSIsImZpcnN0TmFtZSI6IkpvaG4iLCJsYXN0TmFtZSI6IkRvZSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzI2MjQ1MDY2LCJleHAiOjE3MjYyNDY4NjZ9.Kc55B1fM_-RHyijBel-PLBU8eGc2Yo2NgLxMwQxB2oU'
  })
  @IsNotEmpty()
  @IsString()
    refreshToken: string
}
