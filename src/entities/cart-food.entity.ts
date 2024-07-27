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
import * as Validator from "class-validator";

@Index("fk_cart_food_food_id", ["foodId"], {})
@Index("uq_cart_food_cart_id_food_id", ["cartId", "foodId"], { unique: true })
@Entity("cart_food")
export class CartFood {
  @PrimaryGeneratedColumn({ type: "int", name: "cart_food_id", unsigned: true })
  cartFoodId: number;

  @Column({type: "int", name: "cart_id", unsigned: true })
  cartId: number;

  @Column({type: "int", name: "food_id", unsigned: true })
  foodId: number;

  @Column({
    type: "decimal", 
    unsigned: true,
    precision: 10,
    scale: 2,
  })
  @Validator.IsNotEmpty()
  @Validator.IsPositive()
  @Validator.IsNumber({
    allowInfinity: false,
    allowNaN: false,
    maxDecimalPlaces: 0
  })
  quantity: number;

  @ManyToOne(() => Cart, (cart) => cart.cartFoods, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "cart_id", referencedColumnName: "cartId" }])
  cart: Cart;

  @ManyToOne(() => Food, (food) => food.cartFoods, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "food_id", referencedColumnName: "foodId" }])
  food: Food;
}
