import { IsNotEmpty } from "class-validator";

export class CreateMovieDto {
  @IsNotEmpty() // 방패막이 역할
  title: string;

  @IsNotEmpty()
  genre: string;

  // 영화 상세내용 추가
  @IsNotEmpty()
  detail: string;
}
