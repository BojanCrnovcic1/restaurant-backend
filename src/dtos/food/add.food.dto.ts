import { FoodFeaturesComponentDto } from "./food.features.component.dto";
import * as Validator from "class-validator";;
export class AddFoodDto {

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
    
    price: number;

    @Validator.IsArray()
    features: FoodFeaturesComponentDto[];
}