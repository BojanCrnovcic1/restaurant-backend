import { FoodSearchFeatureComponentDto } from "./food.search.feature.component.dto";

export class FoodSearchDto {
    categoryId?: number;
    keywords?: string;
    minPrice: number;
    maxPrice: number;
    features: FoodSearchFeatureComponentDto[];

}