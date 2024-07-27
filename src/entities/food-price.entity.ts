import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Food } from "./food.entity";
import * as Validator from "class-validator";

@Index("fk_food_price_food_id", ["foodId"], {})
@Entity("food_price")
export class FoodPrice {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "food_price_id",
    unsigned: true,
  })
  foodPriceId: number;

  @Column({ type: "int", name: "food_id", unsigned: true })
  foodId: number;

  @Column({ type: "decimal", unsigned: true, precision: 10, scale: 2 })
  @Validator.IsNotEmpty()
  @Validator.IsPositive()
  @Validator.IsNumber({
    allowInfinity: false,
    allowNaN: false,
    maxDecimalPlaces: 2
  })
  price: number;


  @ManyToOne(() => Food, (food) => food.foodPrices, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "food_id", referencedColumnName: "foodId" }])
  food: Food;
}
