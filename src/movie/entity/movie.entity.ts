import { Exclude, Expose, Transform } from "class-transformer";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from "typeorm";
import { BaseTableEntity } from "./base-table.entity";
import { MovieDetail } from "./movie-detail.entity";

/// ManyToOne Director -> 감독은 여개의 영화를 만들수 있ㅡ
/// OneToOne MovieDirector -> 영화는 하나의 상세 내용을 갖을 수 있음
/// ManyToMany Genre - 영화는 여러개의 장르를 가질 수 있ㅇ고 장르는 여러개의 영화에 속할 수 있다 .

@Entity()
export class Movie extends BaseTableEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;

  @Column()
  //값을 커스텀해서 변환시킬 수 있음
  @Transform(({ value }) => value.toString().toUpperCase())
  genre: string;

  // 상대 테이블 레퍼런스도 추가해주면 좋음
  @OneToOne(() => MovieDetail, (movieDetail) => movieDetail.id, {
    cascade: true,
  }) // 모든 관계에서는 함수와 타입을 넣어줘야함
  @JoinColumn() // 주된 쪽에 들고 있는 편이 좋음
  detail: MovieDetail;
}
