import { Controller, Get, Post, Patch, Delete, Param, NotFoundException, Body, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { monitorEventLoopDelay } from 'perf_hooks';

interface Movie {
  id: number;
  title: string;
}

@Controller('movie')
export class AppController {

  private movies: Movie[] =
    [
      {
        id: 1,
        title: '해리포터',
      },
      {
        id: 2,
        title: '단단단',
      }
    ];

  private idCounter = 3; // 새로 생성되는 영화 id 
  constructor(private readonly appService: AppService) { }

  @Get()
  getMovies(@Query('title') title?: string // 쿼리 파라미터로 받아서 분기
  ) {

    if (!title) {
      return this.movies;
    }

    // 쿼리파라미터로 받은 title로 시작하는 영화들을 반환
    return this.movies.filter(m => m.title.startsWith(title));
  }

  @Get(':id')
  // @Param 어떤 파라미터를 가져올지 보통 string으로 온다 
  getMovie(@Param('id') id: string) {
    // string이니까 +로 숫자변환
    const movie = this.movies.find((m) => m.id === +id);
    if (!movie) {
      throw new NotFoundException('존재하지 않는 id의 영화입니다.');
    }
    return movie;
  }

  @Post() // 영화 생성 
  postMovie(
    @Body('title') title: string,
  ) {

    const movie: Movie = {
      id: this.idCounter++,
      title: title,
    };

    this.movies.push(
      movie,
    );

    return movie; // 클라이언트에게 movie를 돌려줌 id 활용을 위해 
  }

  @Patch(':id') // 특정 아이디 가지고 있는 영화 정보 변경
  patchMovie(
    @Param('id') id: string,
    @Body('title') title: string,
  ) {
    const movie = this.movies.find((m) => m.id === +id);

    if (!movie) {
      throw new NotFoundException('존재하지 않는 id의 영화입니다.');
    }

    // assgin으로 같은 프로퍼티 키를 가지는 경우 덮어쓰기 
    Object.assign(movie, { title });

    return movie;
  }

  @Delete(':id')
  deleteMove(@Param('id') id: string) {

    // 조건에 맞는 index를 반환 첫번째
    const movieIndex = this.movies.findIndex((m) => m.id === +id);

    // 값이 존재하지 않는 경우 -1 
    if (movieIndex === -1) {
      throw new NotFoundException('존재하지 않는 id의 영화입니다.');
    }

    // movies배열에서 해당 인덱스에 해당하는 원소 잘라내기
    this.movies.splice(movieIndex, 1);

    return id;
  }
}
