import { IsNotEmpty } from "class-validator";

export class CreateMovieDto {
  @IsNotEmpty() // 방패막이 역할
  title: string;

  @IsNotEmpty()
  genre: string;

  // 영화 상세내용 추가
  @IsNotEmpty()
  detail: string;

  @IsNotEmpty() // 영화 만들 때 감독도 넣어준다. 즉 영화만들 때 감독도 있어야함
  directorId: number;
}
