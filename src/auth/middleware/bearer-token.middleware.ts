import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { NextFunction, Request, Response } from "express";
import { envVariables } from "src/common/const/env.const";

@Injectable()
export class BearerTokenMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // Basic $token
    // Bearer $token
    // 리퀘스트에 있는 헤더에 authorization키 의 값을 가지고 옴
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      next(); // 미들웨어 끝내고 다음으로 가라 즉 여기선 검증할 토큰이 없으니 다음로직으로 넘김
      return;
    }

    // 토큰값이 있는 리퀘스트인 경우
    const token = this.validateBearerToken(authHeader);
    try {
      // 검증은 하지않고 내용을 보는 것
      const decodedPayload = this.jwtService.decode(token);
      // refresh인지 access인지 검증
      if (
        decodedPayload.type !== "refresh" &&
        decodedPayload.type !== "access"
      ) {
        throw new BadRequestException("잘못된 토큰입니다");
      }

      const secretKey =
        decodedPayload.type === "refresh"
          ? envVariables.refreshTokenSecret
          : envVariables.accessTokenSecret;

      // 검증이랑 payload 같이 가지고옴
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>(secretKey),
      });
      // 목적은 req.user에 payload를 붙이는 것
      req.user = payload;
      next(); //다음처리로 넘어가야하니까 무조건 필요!
    } catch (e) {
      throw new BadRequestException("토큰이 만료되었습니다.");
    }
  }

  validateBearerToken(rawToken: string) {
    const basicSplit = rawToken.split(" ");
    if (basicSplit.length !== 2) {
      throw new BadRequestException("토큰 포멧이 잘못됐습니다.!");
    }
    const [bearer, token] = basicSplit;

    if (bearer.toLocaleLowerCase() !== "bearer") {
      throw new BadRequestException("토큰 포멧이 잘못됐습니다.!");
    }

    return token;
  }
}
