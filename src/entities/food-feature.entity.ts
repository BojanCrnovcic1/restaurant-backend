import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Feature } from "./feature.entity";
import { Food } from "./food.entity";

@Index("fk_food_feature_food_id", ["foodId"], {})
@Index("fk_food_feature_feature_id", ["featureId"], {})
@Entity("food_feature", { schema: "public" })
export class FoodFeature {
  @PrimaryGeneratedColumn({ type: "integer", name: "food_feature_id" })
  foodFeatureId: number;

  @Column({ type: "integer", name: "food_id", unsigned: true })
  foodId: number;

  @Column({ type: "integer", name: "feature_id", unsigned: true })
  featureId: number;

  @ManyToOne(() => Feature, (feature) => feature.foodFeatures, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "feature_id", referencedColumnName: "featureId" }])
  feature: Feature;

  @ManyToOne(() => Food, (food) => food.foodFeatures, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "food_id", referencedColumnName: "foodId" }])
  food: Food;
}
