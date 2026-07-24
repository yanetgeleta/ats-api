import { ApiProperty } from '@nestjs/swagger';
import { isEmail, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'admin@example.com',
    description: 'Seeded admin email',
  })
  @IsEmail({}, { message: 'Please provide a valid email address!' })
  email: string;

  @ApiProperty({
    example: 'Admin@12345',
    description: 'Admin password',
  })
  @IsString()
  @IsNotEmpty({ message: 'Password is required!' })
  password: string;
}
