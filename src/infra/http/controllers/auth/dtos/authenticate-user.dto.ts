import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthenticateUserDTO {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email of the user used for authentication.',
  })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @ApiProperty({
    example: 'password123',
    description:
      'The password of the user. Must be at least 6 characters long.',
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;
}

export class AuthenticateResponseDto {
  @ApiProperty({
    description: 'The access token for the authenticated operator.',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;
}
