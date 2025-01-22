import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateMovieDto } from "./dto/create-movie.dto";
import { UpdateMovieDto } from "./dto/update-movie.dto";
import { Movie } from "./entity/movie.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm/repository/Repository";
import { create } from "domain";
import { Like } from "typeorm";
import { MovieDetail } from "./entity/movie-detail.entity";
import { Director } from "src/director/entity/director.entity";
import { dir } from "console";

@Injectable() // IoC container에게 이거 관리해달라고 지정해주는 애노테이션
export class MovieService {
  constructor(
    // 모듈에다가 Movie등록했으니까 자동으로 리포지토리 생성되고 해당 리포지토리 생성된걸 여기서 DI해서 쓴다
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    @InjectRepository(MovieDetail)
    private readonly movieDetailRepository: Repository<MovieDetail>,
    @InjectRepository(Director)
    private readonly directorRepository: Repository<Director>
  ) {}

  async findAll(title?: string) {
    // 나중에 title filter 기능 추가

    if (!title) {
      return [
        await this.movieRepository.find({
          relations: ["director"],
        }),
        await this.movieDetailRepository.count(),
      ];
    }

    // 비슷한 타이틀로 검색할 수 있도록 Like 사용
    return await this.movieRepository.findAndCount({
      where: {
        title: Like(`%${title}%`),
      },
      relations: ["director"],
    });
  }

  async findOne(id: number) {
    {
      const movie = await this.movieRepository.findOne({
        where: {
          id,
        },
        // 영화 movie값 가지고 올 때 같이 가지고 오고 싶은 값을 relations에 넣어주면 됨
        // detail이라는 파라미터는 MovieDetail을 가지고 올테니까 여기서 엮어서 출력되겠네
        relations: ["detail", "director"],
      });
      if (!movie) {
        throw new NotFoundException("존재하지 않는 id의 영화입니다.");
      }
      return movie;
    }
  }

  async create(createMovieDto: CreateMovieDto) {
    const director = await this.directorRepository.findOne({
      where: {
        id: createMovieDto.directorId,
      },
    });

    if (!director) {
      throw new NotFoundException("존재하지 않는 ID의 감독입니다");
    }

    const movie = await this.movieRepository.save({
      title: createMovieDto.title,
      genre: createMovieDto.genre,
      detail: {
        detail: createMovieDto.detail,
      },
      director,
    });
    return movie;
  }

  async update(id: number, updateMoveDto: UpdateMovieDto) {
    const movie = await this.movieRepository.findOne({
      where: {
        id,
      },
      relations: ["detail"],
    });

    if (!movie) {
      throw new NotFoundException("존재하지 않는 id의 영화입니다.");
    }

    const { detail, directorId, ...movieRest } = updateMoveDto;

    let newDirector;

    if (directorId) {
      const director = await this.directorRepository.findOne({
        where: {
          id: directorId,
        },
      });

      if (!director) {
        throw new NotFoundException("존재하지 않는 ID의 감독입니다");
      }
      newDirector = director;
    }

    /**
     *{ 요렇게 들어감
     * ...movieRest,
     * director: director
     * }
     */
    const movieUpdateFields = {
      ...movieRest,
      //newDirector 값이 없으면 그냥 movieRest와 동일
      //값이 있는 경우 director라는 속성에 newDirector를 넣어줌
      ...(newDirector && { director: newDirector }),
    };

    await this.movieRepository.update({ id }, movieUpdateFields);

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

    this.movieRepository.update({ id }, movieRest);

    const newMovie = await this.movieRepository.findOne({
      where: {
        id,
      },
      relations: ["detail", "director"], // 찾을때 감독값도 같이 가져와
    });
    return newMovie;
  }

  async remove(id: number) {
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
