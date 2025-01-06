import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Cart } from "./cart.entity";

@Index("uq_order_cart_id", ["cartId"], { unique: true })
@Entity("order", { schema: "public" })
export class Order {
  @PrimaryGeneratedColumn({ type: "integer", name: "order_id" })
  orderId: number;

  @Column("timestamp without time zone", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column("integer", { name: "cart_id", unique: true })
  cartId: number;

  @Column("text", {
    name: "status",
    nullable: true,
    default: () => "'pending'",
  })
  status: string | null;

  @OneToOne(() => Cart, (cart) => cart.order, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "cart_id", referencedColumnName: "cartId" }])
  cart: Cart;
}
