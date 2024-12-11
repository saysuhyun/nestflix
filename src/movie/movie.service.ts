import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateMovieDto } from "./dto/create-movie.dto";
import { UpdateMovieDto } from "./dto/update-movie.dto";
import { Movie } from "./entity/movie.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm/repository/Repository";
import { create } from "domain";

@Injectable() // IoC container에게 이거 관리해달라고 지정해주는 애노테이션
export class MovieService {
  constructor(
    // 모듈에다가 Movie등록했으니까 자동으로 리포지토리 생성되고 해당 리포지토리 생성된걸 여기서 DI해서 쓴다
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>
  ) {}

  getManyMovies(title?: string) {
    // 나중에 title filter 기능 추가
    return this.movieRepository.find();
    // if (!title) {
    //   return this.movies;
    // }

    // return this.movies.filter((m) => m.title.startsWith(title));
  }

  async getMovieById(id: number) {
    {
      const movie = await this.movieRepository.findOne({
        where: {
          id,
        },
      });
      if (!movie) {
        throw new NotFoundException("존재하지 않는 id의 영화입니다.");
      }
      return movie;
    }
  }

  async createMovie(createMovieDto: CreateMovieDto) {
    const movie = await this.movieRepository.save(createMovieDto);
    return movie;
  }

  async updateMove(id: number, updateMoveDto: UpdateMovieDto) {
    const movie = await this.movieRepository.findOne({
      where: {
        id,
      },
    });

    if (!movie) {
      throw new NotFoundException("존재하지 않는 id의 영화입니다.");
    }

    this.movieRepository.update({ id }, updateMoveDto);

    const newMovie = await this.movieRepository.findOne({
      where: {
        id,
      },
    });
    return newMovie;
  }

  async deleteMovie(id: number) {
    const movie = await this.movieRepository.findOne({
      where: {
        id,
      },
    });
    if (!movie) {
      throw new NotFoundException("존재하지 않는 id의 영화입니다.");
    }

    await this.movieRepository.delete(id);

    return id;
  }
}
