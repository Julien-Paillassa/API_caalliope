import { IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class RefreshTokenDto {
  @ApiProperty({
    description: 'Token of the user',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjMsImVtYWlsIjoiam9obi5kb2VAZXhhbXBsZS5jb20iLCJmaXJzdE5hbWUiOiJKb2huIiwibGFzdE5hbWUiOiJEb2UiLCJyb2xlIjoidXNlciIsImlhdCI6MTcyNDk0ODQwNywiZXhwIjoxNzI0OTUwMjA3fQ.6BkW-HK52mlJUU-1EJalTp6tlUKLo5Kn_AT3CPc65NU'
  })
  @IsNotEmpty()
  @IsString()
    refreshToken: string
}
