import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Food } from "./food.entity";


@Index("uq_category_name", ["name"], { unique: true })
@Entity("category", { schema: "public" })
export class Category {
  @PrimaryGeneratedColumn({ type: "integer", name: "category_id" })
  categoryId: number;

  @Column("character varying", { name: "name", unique: true, length: 128 })
  name: string;

  @ManyToOne(() => Category, (category) => category.categories)
  @JoinColumn([
    { name: "parent_category_id", referencedColumnName: "categoryId" },
  ])
  parentCategory: Category;

  @OneToMany(() => Category, (category) => category.parentCategory)
  categories: Category[];

  @OneToMany(() => Food, (food) => food.category)
  foods: Food[];
}
