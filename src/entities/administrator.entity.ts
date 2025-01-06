import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("administrator_email_key", ["email"], { unique: true })
@Entity("administrator", { schema: "public" })
export class Administrator {
  @PrimaryGeneratedColumn({ type: "integer", name: "administrator_id" })
  administratorId: number;

  @Column("character varying", { name: "email", unique: true, length: 128 })
  email: string;

  @Column("character varying", { name: "password_hash", length: 128 })
  passwordHash: string;
}
