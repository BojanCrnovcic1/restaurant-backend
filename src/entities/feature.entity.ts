import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { FoodFeature } from "./food-feature.entity";
import { Food } from "./food.entity";
import * as Validator from "class-validator";

@Entity("feature")
export class Feature {
  @PrimaryGeneratedColumn({ type: "int", name: "feature_id", unsigned: true })
  featureId: number;

  @Column({ type: "varchar", length: 128 })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Length(5, 128)
  name: string;

  @OneToMany(() => FoodFeature, (foodFeature) => foodFeature.feature)
  foodFeatures: FoodFeature[];

  @ManyToMany(() => Food, (food) => food.features)
  foods: Food[];
}
