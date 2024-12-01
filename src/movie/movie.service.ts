import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

// export 해줘야 컨트롤러에서 Movie 사용이 가능해짐
export interface Movie {
  id: number;
  title: string;
  genre: string;
}

@Injectable() // IoC container에게 이거 관리해달라고 지정해주는 애노테이션 
export class MovieService {


  private movies: Movie[] =
    [
      {
        id: 1,
        title: '해리포터',
        genre: 'fantasy',
      },
      {
        id: 2,
        title: '단단단',
        genre: 'ani',
      }
    ];

  private idCounter = 3; // 새로 생성되는 영화 id 


  getManyMovies(title?: string) {
    if (!title) {
      return this.movies;
    }

    return this.movies.filter(m => m.title.startsWith(title));
  }

  getMovieById(id: number) {
    {
      // string이니까 +로 숫자변환
      const movie = this.movies.find((m) => m.id === +id);
      if (!movie) {
        throw new NotFoundException('존재하지 않는 id의 영화입니다.');
      }
      return movie;
    }
  }

  createMovie(createMovieDto: CreateMovieDto) {
    const movie: Movie = {
      id: this.idCounter++,
      ...createMovieDto,
    }
    this.movies.push(movie,);

    return movie;
  }

  updateMove(id: number, updateMoveDto: UpdateMovieDto) {
    const movie = this.movies.find((m) => m.id === +id);

    if (!movie) {
      throw new NotFoundException('존재하지 않는 id의 영화입니다.');
    }

    // assgin으로 같은 프로퍼티 키를 가지는 경우 덮어쓰기 
    Object.assign(movie, { ...updateMoveDto });

    return movie;
  }

  deleteMovie(id: number) {
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
