import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateMovieDto } from "./dto/create-movie.dto";
import { UpdateMovieDto } from "./dto/update-movie.dto";
import { Movie } from "./entity/movie.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm/repository/Repository";
import { create } from "domain";
import { Like } from "typeorm";
import { MovieDetail } from "./entity/movie-detail.entity";

@Injectable() // IoC container에게 이거 관리해달라고 지정해주는 애노테이션
export class MovieService {
  constructor(
    // 모듈에다가 Movie등록했으니까 자동으로 리포지토리 생성되고 해당 리포지토리 생성된걸 여기서 DI해서 쓴다
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    @InjectRepository(MovieDetail)
    private readonly movieDetailRepository: Repository<MovieDetail>
  ) {}

  async getManyMovies(title?: string) {
    // 나중에 title filter 기능 추가

    if (!title) {
      return [
        await this.movieRepository.find(),
        await this.movieDetailRepository.count(),
      ];
    }

    // 비슷한 타이틀로 검색할 수 있도록 Like 사용
    return await this.movieRepository.findAndCount({
      where: {
        title: Like(`%${title}%`),
      },
    });
  }

  async getMovieById(id: number) {
    {
      const movie = await this.movieRepository.findOne({
        where: {
          id,
        },
        // 영화 movie값 가지고 올 때 같이 가지고 오고 싶은 값을 relations에 넣어주면 됨
        // detail이라는 파라미터는 MovieDetail을 가지고 올테니까 여기서 엮어서 출력되겠네
        relations: ["detail"],
      });
      if (!movie) {
        throw new NotFoundException("존재하지 않는 id의 영화입니다.");
      }
      return movie;
    }
  }

  async createMovie(createMovieDto: CreateMovieDto) {
    const movie = await this.movieRepository.save({
      title: createMovieDto.title,
      genre: createMovieDto.genre,
      detail: {
        detail: createMovieDto.detail,
      },
    });
    return movie;
  }

  async updateMove(id: number, updateMoveDto: UpdateMovieDto) {
    const movie = await this.movieRepository.findOne({
      where: {
        id,
      },
      relations: ["detail"],
    });

    if (!movie) {
      throw new NotFoundException("존재하지 않는 id의 영화입니다.");
    }

    const { detail, ...MovieRest } = updateMoveDto;

    if (detail) {
      await this.movieDetailRepository.update(
        {
          id: movie.detail.id,
        },
        {
          detail,
        }
      );
    }

    this.movieRepository.update({ id }, MovieRest);

    const newMovie = await this.movieRepository.findOne({
      where: {
        id,
      },
      relations: ["detail"],
    });
    return newMovie;
  }

  async deleteMovie(id: number) {
    const movie = await this.movieRepository.findOne({
      where: {
        id,
      },
      relations: ["detail"],
    });
    if (!movie) {
      throw new NotFoundException("존재하지 않는 id의 영화입니다.");
    }

    await this.movieRepository.delete(id);
    await this.movieDetailRepository.delete(movie.detail.id);

    return id;
  }
}
