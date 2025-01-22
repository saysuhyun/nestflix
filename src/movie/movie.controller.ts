import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
  BadRequestException,
} from "@nestjs/common";
import { MovieService } from "./movie.service";
import { CreateMovieDto } from "./dto/create-movie.dto";
import { UpdateMovieDto } from "./dto/update-movie.dto";
import { MovieTitleValidationPipe } from "./pipe/movie-title-validation.pipe";

@Controller("movie")
@UseInterceptors(ClassSerializerInterceptor) //Class-Transfomer를 해당 컨트롤러에 적용하겠다
export class MovieController {
  // AppService가 생성자로 만들어짐 DI
  // 컨트롤러가 생성될 때 밑의 서비스도 생성되어야 함
  constructor(private readonly movieService: MovieService) {}

  @Get()
  getMovies(
    @Query("title", MovieTitleValidationPipe) title?: string // 쿼리 파라미터로 받아서 분기
  ) {
    return this.movieService.findAll(title);
  }

  @Get(":id")
  // @Param 어떤 파라미터를 가져올지 보통 string으로 온다
  // ParseIntPipe가 id 파리미터를 숫자가 아니면 에러가 나도록 유효성 검사를 해줌
  getMovie(
    @Param(
      "id",
      new ParseIntPipe({
        exceptionFactory(error) {
          // 에러 메세지를 커스터마이징
          throw new BadRequestException("숫자를 입력해주세요 ");
        },
      })
    )
    id: number
  ) {
    return this.movieService.findOne(id);
  }

  @Post() // 영화 생성
  postMovie(@Body() body: CreateMovieDto) {
    return this.movieService.create(body);
  }

  @Patch(":id") // 특정 아이디 가지고 있는 영화 정보 변경
  patchMovie(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: UpdateMovieDto
  ) {
    return this.movieService.update(id, body);
  }

  @Delete(":id")
  deleteMove(@Param("id", ParseIntPipe) id: number) {
    return this.movieService.remove(id);
  }
}
