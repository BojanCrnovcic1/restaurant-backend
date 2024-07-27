import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";
import * as Validator from "class-validator";

@Index("uq_administrator_email", ["email"], { unique: true })
@Entity("administrator")
export class Administrator {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "administrator_id",
    unsigned: true,
  })
  administratorId: number;

  @Column( {
    type: "varchar",
    unique: true,
    length: 128,
  })
  @Validator.IsNotEmpty()
  @Validator.IsEmail({
      allow_ip_domain: false,
      allow_utf8_local_part: true,
      require_tld: true
  })
  email: string;

  @Column({
    type: "varchar", 
    name: "password_hash",
    length: 128,
  })
  @Validator.IsNotEmpty()
  @Validator.IsHash('sha512')
  passwordHash: string;
}
