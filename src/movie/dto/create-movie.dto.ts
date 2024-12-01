import { IsNotEmpty } from "class-validator";

export class CreateMovieDto {

    @IsNotEmpty() // 방패막이 역할
    title: string;

    @IsNotEmpty()
    genre: string;
}