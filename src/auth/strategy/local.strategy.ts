import { Injectable } from "@nestjs/common";
import { AuthGuard, PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";

export class LocalAuthGuard extends AuthGuard("local") {}

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  // 모든 전략은 생성자 안에 슈퍼를 넣어줘야함
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: "email", // username이라는 필드를 email로 변경 앞으로 파라미터는 email로 보내야함
    });
  }

  /**
   * LocalStrategy
   * // 로컬 전략의 경우 파라미터로 유저네임과 비밀번호를 넣어줌
   * validate : username , password
   * return -> Request(); // 반환값을 컨트롤러에서 리퀘스트 객체로 받음
   */
  async validate(username: string, password: string) {
    // auth에서 basic토큰으로 하기로 했는디.;
    const user = await this.authService.authenticate(username, password);
    return user;
  }
}
