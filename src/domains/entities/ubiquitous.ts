import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "ubiquitous" })
export class Ubiquitous {
  @PrimaryGeneratedColumn()
  readonly id!: number;

  @Column("text", { comment: "キーワード", nullable: false })
  keyword: string;

  @Column("text", { comment: "詳細", nullable: false })
  detail: string;
}
