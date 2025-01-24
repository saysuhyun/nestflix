import { ExceptionsHandler } from "@nestjs/core/exceptions/exceptions-handler";
import { Exclude } from "class-transformer";
import { BaseTable } from "src/common/entity/base-table.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

// 유저 종류를 정의
export enum Role {
  admin,
  paidUser,
  user,
}

@Entity()
export class User extends BaseTable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  @Exclude({
    toPlainOnly: true, // 응답으로 보낼때는 제외!
  }) // response에 제외
  password: string;

  @Column({
    enum: Role, // enum 사용하기 위해서
    default: Role.user,
  })
  role: Role;
}
