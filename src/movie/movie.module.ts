import { Module } from "@nestjs/common";
import { MovieService } from "./movie.service";
import { MovieController } from "./movie.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Movie } from "./entity/movie.entity";
import { MovieDetail } from "./entity/movie-detail.entity";
import { Director } from "src/director/entity/director.entity";
import { Genre } from "src/genre/entities/genre.entity";

@Module({
  // forFeature 안에 사용하고 싶은 엔티티를 리스트로
  // 알아서 해당 리포지토리의 디비 만들어주나봄
  imports: [TypeOrmModule.forFeature([Movie, MovieDetail, Director, Genre])],
  controllers: [MovieController],
  providers: [MovieService],
})
export class MovieModule {}
