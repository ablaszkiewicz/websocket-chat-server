import { IsNotEmpty, MinLength, IsString } from 'class-validator';

export class LoginUserDto {
    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    password: string;
} 
