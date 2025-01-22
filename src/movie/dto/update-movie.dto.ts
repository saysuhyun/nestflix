import { CreateMovieDto } from "./create-movie.dto";
import { PartialType } from "@nestjs/mapped-types";

// CreateMovieDto에 있는 파라미터들을 가지고 와서 이걸 옵셔널로 변경하고 그대로 사용
export class UpdateMovieDto extends PartialType(CreateMovieDto) {}
