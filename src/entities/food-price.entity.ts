import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Food } from "./food.entity";

@Index("fk_food_price_food_id", ["foodId"], {})
@Entity("food_price", { schema: "public" })
export class FoodPrice {
  @PrimaryGeneratedColumn({ type: "integer", name: "food_price_id" })
  foodPriceId: number;

  @Column({ type: "integer", name: "food_id", unsigned: true })
  foodId: number;

  @Column("numeric", { name: "price", precision: 10, scale: 2 })
  price: number;

  @ManyToOne(() => Food, (food) => food.foodPrices)
  @JoinColumn([{ name: "food_id", referencedColumnName: "foodId" }])
  food: Food;
}
