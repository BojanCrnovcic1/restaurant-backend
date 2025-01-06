import {
  Column,
  Entity,
  Index,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { FoodFeature } from "./food-feature.entity";
import { Food } from "./food.entity";

@Entity("feature", { schema: "public" })
export class Feature {
  @PrimaryGeneratedColumn({ type: "integer", name: "feature_id" })
  featureId: number;

  @Column("character varying", { name: "name", length: 128 })
  name: string;

  @OneToMany(() => FoodFeature, (foodFeature) => foodFeature.feature)
  foodFeatures: FoodFeature[];

  @ManyToMany(() => Food, (food) => food.features)
  foods: Food[];
}
