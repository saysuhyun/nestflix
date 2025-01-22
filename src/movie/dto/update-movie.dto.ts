import {
  Equals,
  IsDefined,
  IsNotEmpty,
  IsOptional,
  IsIn,
  IsBoolean,
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidatorConstraint,
  Validate,
  ValidationOptions,
  registerDecorator,
} from "class-validator";

enum MovieGenre {
  Fantasy = "fantasy",
  Action = "action",
}

export class UpdateMovieDto {
  @IsNotEmpty() // 만약 값이 있다면 null이면 안 됨
  @IsOptional() // 값은 있어도 되고 없어도 되는 옵션값
  title?: string; // 둘 중 어떤 값이 될지 모르니까

  @IsNotEmpty()
  @IsOptional()
  genre?: string;

  @IsNotEmpty()
  @IsOptional()
  detail?: string;

  @IsNotEmpty() // 영화 만들 때 감독도 넣어준다. 즉 영화만들 때 감독도 있어야함
  @IsOptional()
  directorId?: number;
}
