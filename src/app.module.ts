import { Inject, Module } from "@nestjs/common";
import { MovieModule } from "./movie/movie.module";
import { Movie } from "./movie/entity/movie.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import * as Joi from "joi";
import { MovieDetail } from "./movie/entity/movie-detail.entity";
import { DirectorModule } from "./director/director.module";
import { Director } from "./director/entity/director.entity";
import { GenreModule } from "./genre/genre.module";
import { Genre } from "./genre/entities/genre.entity";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { User } from "./user/entities/user.entity";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 어떤 모듈에서라도 해당 환경변수 쓸 수 있도록 세팅
      validationSchema: Joi.object({
        ENV: Joi.string().valid("dev", "prod").required(),
        DB_TYPE: Joi.string().valid("postgres").required(), // 필수값인데 값은 무조건 postgres
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
        HASH_ROUNDS: Joi.number().required(),
      }),
    }),
    // 디비연동
    // Async 비동기 이유 : configModule이 전부 인스턴스화 IoC 컨테이너에 생성된 후에 쓰니가 Async
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: configService.get<string>("DB_TYPE") as "postgres",
        host: configService.get<string>("DB_HOST"),
        port: configService.get<number>("DB_PORT"),
        username: configService.get<string>("DB_USERNAME"),
        password: configService.get<string>("DB_PASSWORD"),
        database: configService.get<string>("DB_DATABASE"),
        entities: [
          // 엔티티 넣을 꺼 추가
          Movie,
          MovieDetail,
          Director,
          Genre,
          User,
        ],
        synchronize: true,
      }),
      inject: [ConfigService], // IOC에서 주입해줄려는 친구 여기서 선언해주면 됨
    }),

    // TypeOrmModule.forRoot({
    //   type: process.env.DB_TYPE as "postgres",
    //   host: process.env.DB_HOST,
    //   port: parseInt(process.env.DB_PORT),
    //   username: process.env.DB_USERNAME,
    //   password: process.env.DB_PASSWORD,
    //   database: process.env.DB_DATABSE,
    //   entities: [],
    //   synchronize: true, // 개발할 때만 켜놓음 프로덕션 데이터베이스에서는 이거 안 쓴다 . 잘못하면 다 날라감
    // }), // 모듈 불러올 때 forRoot 씀 등록할때 데이터베이스 정보
    MovieModule,

    DirectorModule,

    GenreModule,

    AuthModule,

    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
