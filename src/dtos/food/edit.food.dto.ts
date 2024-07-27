import { FoodFeaturesComponentDto } from "./food.features.component.dto";
import * as Validator from "class-validator";
export class EditFoodDto {
    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(3, 255)
    name: string;
    categoryId: number;

    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(6, 10000)
    description: string;

    @Validator.IsNotEmpty()
    @Validator.IsPositive()
    @Validator.IsNumber({
      allowInfinity: false,
      allowNaN: false,
      maxDecimalPlaces: 2
    })
    price: number;
    features: FoodFeaturesComponentDto[];
}