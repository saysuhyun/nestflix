import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { MovieService } from './movie.service';

@Controller('movie')
export class MovieController {

  // AppService가 생성자로 만들어짐 DI
  // 컨트롤러가 생성될 때 밑의 서비스도 생성되어야 함
  constructor(private readonly movieService: MovieService) { }

  @Get()
  getMovies(@Query('title') title?: string // 쿼리 파라미터로 받아서 분기
  ) {
    return this.movieService.getManyMovies(title);
  }

  @Get(':id')
  // @Param 어떤 파라미터를 가져올지 보통 string으로 온다 
  getMovie(@Param('id') id: string) {
    return this.movieService.getMovieById(+id);
  }

  @Post() // 영화 생성 
  postMovie(
    @Body('title') title: string,
  ) {
    return this.movieService.createMovie(title);
  }

  @Patch(':id') // 특정 아이디 가지고 있는 영화 정보 변경
  patchMovie(
    @Param('id') id: string,
    @Body('title') title: string,
  ) {
    return this.movieService.updateMove(+id, title);
  }

  @Delete(':id')
  deleteMove(@Param('id') id: string) {
    return this.movieService.deleteMovie(+id);
  }
}
