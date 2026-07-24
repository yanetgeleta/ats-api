import { ApiProperty } from '@nestjs/swagger';

export class ParsedResumeDto {
  @ApiProperty({ example: 'Yanet Geleta' })
  name: string;

  @ApiProperty({ example: 'yanetgele@gmail.com' })
  email: string;

  @ApiProperty({ example: '+251941493222', nullable: true, required: false })
  phone?: string | null;
}
