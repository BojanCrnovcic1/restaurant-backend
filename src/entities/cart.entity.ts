import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user.entity";
import { CartFood } from "./cart-food.entity";
import { Order } from "./order.entity";

@Index("fk_cart_user_id", ["userId"], {})
@Entity("cart", { schema: "public" })
export class Cart {
  @PrimaryGeneratedColumn({ type: "integer", name: "cart_id" })
  cartId: number;

  @Column({type: "integer", name: "user_id", unsigned: true })
  userId: number;

  @Column("timestamp without time zone", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.carts)
  @JoinColumn([{ name: "user_id", referencedColumnName: "userId" }])
  user: User;

  @OneToMany(() => CartFood, (cartFood) => cartFood.cart)
  cartFoods: CartFood[];

  @OneToOne(() => Order, (order) => order.cart)
  order: Order;
}
