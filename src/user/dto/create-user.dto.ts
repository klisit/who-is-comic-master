import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Roles } from 'src/roles/roles.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(6, 20)
  @ApiProperty({
    description: 'username',
  })
  username: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 64)
  @ApiProperty({ description: 'passsword' })
  password: string;

  @ApiPropertyOptional({ description: 'role' })
  roles?: Roles[] | number[];
}
