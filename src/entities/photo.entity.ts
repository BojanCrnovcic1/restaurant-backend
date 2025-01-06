import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Food } from "./food.entity";

@Index("fk_photo_food_id", ["foodId"], {})
@Index("uq_photo_image_path", ["imagePath"], { unique: true })
@Entity("photo", { schema: "public" })
export class Photo {
  @PrimaryGeneratedColumn({ type: "integer", name: "photo_id" })
  photoId: number;

  @Column({ type: "integer", name: "food_id", unsigned: true })
  foodId: number;

  @Column("character varying", {
    name: "image_path",
    unique: true,
    length: 128,
  })
  imagePath: string;

  @ManyToOne(() => Food, (food) => food.photos, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "food_id", referencedColumnName: "foodId" }])
  food: Food;
}
