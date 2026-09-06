import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class SignupDto {
  @IsString() @MinLength(2) @MaxLength(100) name!: string;
  @IsEmail() email!: string;
  @IsString() @Matches(/^\+?[1-9]\d{7,14}$/) phone!: string;
  @IsString() @MinLength(10) @MaxLength(128) password!: string;
}

export class LoginDto {
  @IsEmail() email!: string;
  @IsString() @MinLength(1) @MaxLength(128) password!: string;
}

export class ForgotPasswordDto {
  @IsEmail() email!: string;
}

export class ResetPasswordDto {
  @IsString() @MinLength(1) token!: string;
  @IsString() @MinLength(10) @MaxLength(128) password!: string;
}
