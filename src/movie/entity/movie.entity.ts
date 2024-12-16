import { Exclude, Expose, Transform } from "class-transformer";
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from "typeorm";

export class BaseEntity {
  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @VersionColumn()
  version: number;
}

// export 해줘야 컨트롤러에서 Movie 사용이 가능해짐
//@Exclude() // 클래스 기본으로 노출 시키지 않고 파라미터 중 @Expose 있는 것만 노출 시킴  기본은 Expose()
@Entity()
export class Movie extends BaseEntity {
  //@Expose()
  @PrimaryGeneratedColumn()
  id: number;

  //@Expose()
  @Column()
  title: string;

  //@Expose()
  @Column()
  //@Exclude() // 직렬화/역질렬화 과정에서 해당 값을 반환시키지 않음
  //값을 커스텀해서 변환시킬 수 있음
  @Transform(({ value }) => value.toString().toUpperCase())
  genre: string;
}
