import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from "@nestjs/common";

@Injectable()
// <들어온 거 , 나갈거 > 문자열 들어오고 문자열을 반환
export class MovieTitleValidationPipe implements PipeTransform<string, string> {
  transform(value: string, metadata: ArgumentMetadata): string {
    if (!value) {
      // 타이틀이 없는 경우는 그냥 넘어가도록
      return value;
    }
    // 만약 글자 길이가 2보다 작으면 에러 던지기
    if (value.length <= 2) {
      throw new BadRequestException("영화의 제목은 3자이상 작성해주세요 ");
    }
    return value;
  }
}
