import { CreateDateColumn, UpdateDateColumn, VersionColumn } from "typeorm";

export class BaseTableEntity {
  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @VersionColumn()
  version: number;
}
