import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Cart } from "./cart.entity";

@Index("uq_user_email", ["email"], { unique: true })
@Index("uq_user_phone_number", ["phoneNumber"], { unique: true })
@Entity("user", { schema: "public" })
export class User {
  @PrimaryGeneratedColumn({ type: "integer", name: "user_id" })
  userId: number;

  @Column("character varying", { name: "email", unique: true, length: 128 })
  email: string;

  @Column("character varying", { name: "password_hash", length: 128 })
  passwordHash: string;

  @Column("character varying", { name: "forename", length: 64 })
  forename: string;

  @Column("character varying", { name: "surname", length: 64 })
  surname: string;

  @Column("character varying", {
    name: "phone_number",
    unique: true,
    length: 21,
  })
  phoneNumber: string;

  @Column("text", { name: "postal_address" })
  postalAddress: string;

  @OneToMany(() => Cart, (cart) => cart.user)
  carts: Cart[];
}
