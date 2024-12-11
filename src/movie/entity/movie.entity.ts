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

// export 해줘야 컨트롤러에서 Movie 사용이 가능해짐
@Exclude() // 클래스 기본으로 노출 시키지 않고 파라미터 중 @Expose 있는 것만 노출 시킴  기본은 Expose()
@Entity()
export class Movie {
  @Expose()
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @Column()
  title: string;

  @Expose()
  @Column()
  //@Exclude() // 직렬화/역질렬화 과정에서 해당 값을 반환시키지 않음
  //값을 커스텀해서 변환시킬 수 있음
  @Transform(({ value }) => value.toString().toUpperCase())
  genre: string;

  // get으로 나중에 응답에서 실제 파라미터에 접근해서 값을 반환시킬 때 get으로 쓰면 편하다
  // @Expose()
  // get decription() {
  //     return `id: ${this.id} , title: ${this.title}`;
  // }
  @Expose()
  @CreateDateColumn()
  createAt: Date;

  @Expose()
  @UpdateDateColumn()
  updateAt: Date;

  @Expose()
  @VersionColumn()
  version: number;
}
