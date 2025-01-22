import { ExceptionsHandler } from "@nestjs/core/exceptions/exceptions-handler";
import { Exclude } from "class-transformer";
import { CreateDateColumn, UpdateDateColumn, VersionColumn } from "typeorm";

export class BaseTable {
  @CreateDateColumn()
  @Exclude() // 응답값에 안 넣어도 되는 경우
  createAt: Date;

  @UpdateDateColumn()
  @Exclude()
  updateAt: Date;

  @VersionColumn()
  @Exclude()
  version: number;
}
