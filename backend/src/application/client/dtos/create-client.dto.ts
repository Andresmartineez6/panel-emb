import { IsString, IsEmail, IsNotEmpty, MinLength, MaxLength, Matches } from 'class-validator';

export class CreateClientDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'Client name must have at least 2 characters' })
  @MaxLength(100, { message: 'Client name cannot exceed 100 characters' })
  name: string;

  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[6789]\d{8}$/, { message: 'Invalid Spanish phone number format' })
  phone: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5, { message: 'Address must have at least 5 characters' })
  @MaxLength(200, { message: 'Address cannot exceed 200 characters' })
  address: string;

  @IsString()
  @IsNotEmpty()
  @Matches(
    /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$|^[ABCDEFGHJNPQRSUVW][0-9]{7}[0-9A-J]$/,
    { message: 'Invalid Spanish Tax ID format (NIF/CIF)' }
  )
  taxId: string;
}
