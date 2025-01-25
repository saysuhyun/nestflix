import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/user/entities/user.entity";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService // auth.module에서 등록했으니까 주입 가능
  ) {}

  parseBasicToken(rawToken: string) {
    /// 1) token을  ' ' 기준으로 스플릿 후 토큰 값만 추출
    const basicSplit = rawToken.split(" ");
    if (basicSplit.length !== 2) {
      throw new BadRequestException("토큰 포멧이 잘못됐습니다.!");
    }
    /// [Baisc, $token]
    const [_, token] = basicSplit;

    ///2 추출한 토큰을 base64 디코딩 후 이메일과 비밀번호로 나눈다
    // bas364로 인코딩 된 걸 utf8로 변경
    const decoded = Buffer.from(token, "base64").toString("utf-8");

    ///3 email:password : 디코딩 값
    const tokenSplit = decoded.split(":");
    if (tokenSplit.length !== 2) {
      throw new BadRequestException("토큰 포멧이 잘못됐습니다.!");
    }

    const [email, password] = tokenSplit;

    return {
      email,
      password,
    };
  }

  // rawToken -> "Basic $token"
  async register(rawToken: string) {
    const { email, password } = this.parseBasicToken(rawToken);

    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (user) {
      throw new BadRequestException("이미 가입된 이메일 입니다.");
    }

    //round가 커지면 해쉬가 커짐 (두번째 파라미터) 비번을 해쉬한 값을 리턴
    const hash = await bcrypt.hash(
      password,
      this.configService.get<number>("HASH_ROUNDS")
    );

    await this.userRepository.save({
      email,
      password: hash,
    });

    return this.userRepository.findOne({
      where: {
        email,
      },
    });
  }

  async authenticate(email: string, password: string) {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw new BadRequestException("잘못된 로그인 정보입니다.");
    }

    // 그냥 password와 디비 저장된 user의 password 비교
    const passOk = await bcrypt.compare(password, user.password);

    if (!passOk) {
      throw new BadRequestException("잘못된 로그인 정보입니다.");
    }
    return user;
  }

  async issueToken(user: User, isRefreshtoken: boolean) {
    const refreshTokenSecret = this.configService.get<string>(
      "ACCESS_TOKEN_SECRET"
    );
    const accessTokenSecret = this.configService.get<string>(
      "REFRESH_TOKEN_SECRET"
    );

    return this.jwtService.signAsync(
      // 밑의 키가 리스폰스로 날라감
      {
        sub: user.id,
        role: user.role,
        type: isRefreshtoken ? "refresh" : "access",
      },
      {
        secret: isRefreshtoken ? refreshTokenSecret : accessTokenSecret,
        expiresIn: isRefreshtoken ? "24h" : 300,
      }
    );
  }

  async login(rawToken: string) {
    const { email, password } = this.parseBasicToken(rawToken);
    const user = await this.authenticate(email, password);

    return {
      refreshToken: await this.issueToken(user, true),
      accessToken: await this.issueToken(user, false),
    };
  }
}