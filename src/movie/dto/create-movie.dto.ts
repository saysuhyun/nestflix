import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
} from "class-validator";

export class CreateMovieDto {
  @IsNotEmpty() // 방패막이 역할
  @IsString()
  title: string;

  // 영화 상세내용 추가
  @IsNotEmpty()
  @IsString()
  detail: string;

  @IsNotEmpty() // 영화 만들 때 감독도 넣어준다. 즉 영화만들 때 감독도 있어야함
  @IsNumber()
  directorId: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber(
    {},
    {
      each: true, // 리스트안에 모든 값을 각각 검증하고 숫자여야ㅐ한다
    }
  )
  genreIds: number[];
}
