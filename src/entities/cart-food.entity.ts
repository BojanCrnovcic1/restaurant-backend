import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Cart } from "./cart.entity";
import { Food } from "./food.entity";

@Index("fk_cart_food_food_id", ["foodId"], {})
@Index("uq_cart_food_cart_id_food_id", ["cartId", "foodId"], { unique: true })
@Entity("cart_food", { schema: "public" })
export class CartFood {
  @PrimaryGeneratedColumn({ type: "integer", name: "cart_food_id" })
  cartFoodId: number;

  @Column("integer", { name: "cart_id", unique: true })
  cartId: number;

  @Column("integer", { name: "food_id", unique: true })
  foodId: number;

  @Column("numeric", { name: "quantity", precision: 10, scale: 2 })
  quantity: number;

  @ManyToOne(() => Cart, (cart) => cart.cartFoods, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "cart_id", referencedColumnName: "cartId" }])
  cart: Cart;

  @ManyToOne(() => Food, (food) => food.cartFoods, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "food_id", referencedColumnName: "foodId" }])
  food: Food;
}
