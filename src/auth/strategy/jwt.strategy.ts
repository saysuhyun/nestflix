import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AuthGuard, PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
export class JwtAuthGuard extends AuthGuard("jwt") {}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      // Bearer token으로 받으니까
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // 만료기간 무시하고 토큰 검증할건지
      // 액세스 키 지정
      secretOrKey: configService.get<string>("ACCESS_TOKEN_SECRET"),
    });
  }

  validate(payload: any) {
    return payload;
  }
}
