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

@Index("fk_photo_food_id", ["foodId"], {})
@Index("uq_photo_image_path", ["imagePath"], { unique: true })
@Entity("photo")
export class Photo {
  @PrimaryGeneratedColumn({ type: "int", name: "photo_id", unsigned: true })
  photoId: number;

  @Column({ type: "int", name: "food_id", unsigned: true })
  foodId: number;

  @Column({ type: "varchar", name: "image_path", unique: true, length: 128 })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Length(1, 128)
  imagePath: string;

  @ManyToOne(() => Food, (food) => food.photos, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "food_id", referencedColumnName: "foodId" }])
  food: Food;
}
