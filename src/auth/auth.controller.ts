import {
  Controller,
  Post,
  Headers,
  Request,
  UseGuards,
  Get,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthGuard } from "@nestjs/passport";
import { LocalAuthGuard } from "./strategy/local.strategy";
import { JwtAuthGuard } from "./strategy/jwt.strategy";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  // authorization: Basic $token
  registerUser(@Headers("authorization") token: string) {
    return this.authService.register(token);
  }

  @Post("login")
  loginUser(@Headers("authorization") token: string) {
    return this.authService.login(token);
  }

  @UseGuards(LocalAuthGuard) // authGuard를 적용
  @Post("login/passport")
  async loginUserPassport(@Request() req) {
    return {
      refreshToken: await this.authService.issueToken(req.user, true),
      accessToken: await this.authService.issueToken(req.user, false),
    };
  }

  @UseGuards(JwtAuthGuard) // 토큰이 잘못되면 가드니까 튕겨냄
  @Get("private")
  async private(@Request() req) {
    return req.user;
  }

  @Post("token/access")
  async rotateAccessToken(@Request() req) {
    return {
      accesstoken: await this.authService.issueToken(req.user, false),
    };
  }
}
