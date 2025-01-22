import { Exclude, Expose, Transform } from "class-transformer";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from "typeorm";
import { BaseTable } from "../../common/entity/base-table.entity";
import { MovieDetail } from "./movie-detail.entity";
import { Director } from "src/director/entity/director.entity";
import { Genre } from "src/genre/entities/genre.entity";

/// ManyToOne Director -> 감독은 여개의 영화를 만들수 있ㅡ
/// OneToOne MovieDirector -> 영화는 하나의 상세 내용을 갖을 수 있음
/// ManyToMany Genre - 영화는 여러개의 장르를 가질 수 있ㅇ고 장르는 여러개의 영화에 속할 수 있다 .

@Entity()
export class Movie extends BaseTable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  // 유니크화
  title: string;

  @JoinTable() // 다대다에선 어디에 JoinTable넣어도 오케
  @ManyToMany(() => Genre, (genre) => genre.movies)
  genres: Genre[];

  // 상대 테이블 레퍼런스도 추가해주면 좋음
  @OneToOne(() => MovieDetail, (movieDetail) => movieDetail.id, {
    // movie 엔티티 만들때 MovieDetail도 같이 만들어줘라 cascade
    cascade: true,
    nullable: false,
  }) // 모든 관계에서는 함수와 타입을 넣어줘야함
  @JoinColumn() // 주된 쪽에 들고 있는 편이 좋음
  detail: MovieDetail;

  @ManyToOne(() => Director, (director) => director.id, {
    cascade: true, // Movie 만들어질 때 director도 저장됨
    nullable: false, // 영화에서 감독이 null일 수는 없기에 에러
  })
  director: Director;
}
