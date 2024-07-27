import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CartFood } from "./cart-food.entity";
import { Category } from "./category.entity";
import { FoodFeature } from "./food-feature.entity";
import { FoodPrice } from "./food-price.entity";
import { Photo } from "./photo.entity";
import { Feature } from "./feature.entity";
import * as Validator from "class-validator";

@Index("fk_food_category_id", ["categoryId"], {})
@Entity("food")
export class Food {
  @PrimaryGeneratedColumn({ type: "int", name: "food_id", unsigned: true })
  foodId: number;

  @Column({ type: "varchar", length: 255 })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Length(3, 255)
  name: string;

  @Column({ type: "int", name: "category_id", unsigned: true })
  categoryId: number;

  @Column({ type: "text" })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Length(6, 10000)
  description: string;

  @Column({
    type: "timestamp", 
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @OneToMany(() => CartFood, (cartFood) => cartFood.food)
  cartFoods: CartFood[];

  @ManyToOne(() => Category, (category) => category.foods, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "category_id", referencedColumnName: "categoryId" }])
  category: Category;

  @OneToMany(() => FoodFeature, (foodFeature) => foodFeature.food)
  foodFeatures: FoodFeature[];

  @ManyToMany(() => Feature, (feature) => feature.foods)
  @JoinTable({
    name: "food_feature",
    joinColumn: { name: "food_id", referencedColumnName: "foodId" },
    inverseJoinColumn: { name: "feature_id", referencedColumnName: "featureId" }
  })
  features: Feature[];

  @OneToMany(() => FoodPrice, (foodPrice) => foodPrice.food)
  foodPrices: FoodPrice[];

  @OneToMany(() => Photo, (photo) => photo.food)
  photos: Photo[];
}
