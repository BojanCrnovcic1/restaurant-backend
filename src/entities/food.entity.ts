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

@Index("fk_food_category_id", ["categoryId"], {})
@Entity("food", { schema: "public" })
export class Food {
  @PrimaryGeneratedColumn({ type: "integer", name: "food_id" })
  foodId: number;

  @Column("character varying", { name: "name", length: 255 })
  name: string;

  @Column({ type: "integer", name: "category_id", unsigned: true })
  categoryId: number;

  @Column("text", { name: "description" })
  description: string;

  @Column("timestamp without time zone", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @OneToMany(() => CartFood, (cartFood) => cartFood.food)
  cartFoods: CartFood[];

  @ManyToOne(() => Category, (category) => category.foods)
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
