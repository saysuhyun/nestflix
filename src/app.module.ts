import {
  Inject,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
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
import { envVariables } from "./common/const/env.const";
import { BearerTokenMiddleware } from "./auth/middleware/bearer-token.middleware";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 어떤 모듈에서라도 해당 환경변수 쓸 수 있도록 세팅
      validationSchema: Joi.object({}),
    }),
    // 디비연동
    // Async 비동기 이유 : configModule이 전부 인스턴스화 IoC 컨테이너에 생성된 후에 쓰니가 Async
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: configService.get<string>(envVariables.dbType) as "postgres",
        host: configService.get<string>(envVariables.dbHost),
        port: configService.get<number>(envVariables.dbPort),
        username: configService.get<string>(envVariables.dbUserName),
        password: configService.get<string>(envVariables.dbPassword),
        database: configService.get<string>(envVariables.dbDatabase),
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
export class AppModule implements NestModule {
  //middleware 글로벌 적용
  configure(consumer: MiddlewareConsumer) {
    // 모든 라우트에 대해서 BearerTOkenMiddleware를 적용한다
    consumer
      .apply(BearerTokenMiddleware)
      // 해당 경로에서는 미들웨어 적용 제외
      .exclude(
        { path: "auth/login", method: RequestMethod.POST },
        {
          path: "auth/register",
          method: RequestMethod.POST,
        }
      )
      .forRoutes("*");
  }
}
