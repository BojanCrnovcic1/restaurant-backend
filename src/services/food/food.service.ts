import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AddFoodDto } from "src/dtos/food/add.food.dto";
import { EditFoodDto } from "src/dtos/food/edit.food.dto";
import { Feature } from "src/entities/feature.entity";
import { FoodFeature } from "src/entities/food-feature.entity";
import { FoodPrice } from "src/entities/food-price.entity";
import { Food } from "src/entities/food.entity";
import { ApiResponse } from "src/misc/api.response.class";
import { Like, Repository } from "typeorm";

@Injectable()
export class FoodService {
    constructor(
        @InjectRepository(Food) private readonly foodRepository: Repository<Food>,
        @InjectRepository(FoodPrice) private readonly foodPriceRepository: Repository<FoodPrice>,
        @InjectRepository(FoodFeature) private readonly foodFeatureRepository: Repository<FoodFeature>,
        @InjectRepository(Feature) private readonly featureRepository: Repository<Feature>
    ) {}

    async getAllFoods(): Promise <Food[]> {
        return this.foodRepository.find({
            relations: ['cartFoods', 'category', 'foodFeatures', 'foodPrices', 'features', 'photos']
        });
    }

    async getFoodById(foodId: number): Promise<Food | ApiResponse> {
        const food = await this.foodRepository.findOne({where: {foodId: foodId}, 
                    relations: ['cartFoods', 'category', 'foodFeatures', 'foodPrices', 'features', 'photos']});
       
        if (!food) {
            return new ApiResponse('error', -3001, 'Food not found!');
        }
        return food;
    }

    async createFood(data: AddFoodDto): Promise<Food | ApiResponse> {
        let newFood: Food = new Food();
        newFood.name = data.name;
        newFood.categoryId = data.categoryId;
        newFood.description = data.description;

        let savedFood = await this.foodRepository.save(newFood);
        
        let newFoodPrice: FoodPrice = new FoodPrice();
        newFoodPrice.foodId = savedFood.foodId;
        newFoodPrice.price = data.price;
        await this.foodPriceRepository.save(newFoodPrice);

        for (let feature of data.features) {
            let newFoodFeature: FoodFeature = new FoodFeature();
            newFoodFeature.foodId = savedFood.foodId;
            newFoodFeature.featureId = feature.featureId;

            await this.foodFeatureRepository.save(newFoodFeature);
        }

        return await this.foodRepository.findOne({
            where: { foodId: savedFood.foodId },
            relations: ['cartFoods', 'category', 'foodFeatures', 'foodFeatures.feature', 'photos']
        });
    }

    async editFood(foodId: number, data: EditFoodDto): Promise<Food | ApiResponse> {
        const existingFood = await this.foodRepository.findOne({where: {foodId: foodId}, 
                                                        relations: ['foodFeatures', 'foodPrices']});
        if (!existingFood) {
            return new ApiResponse('error', -3001, 'Food not found!');
        }
        existingFood.name = data.name;
        existingFood.categoryId = data.categoryId;
        existingFood.description = data.description;

        const savedFood = await this.foodRepository.save(existingFood);

        if (!savedFood) {
            return new ApiResponse('error', -3002, 'Could not save new food data!');
        }

        const newPriceString: string = Number(data.price).toFixed(2);
        const lastPrice = existingFood.foodPrices[existingFood.foodPrices.length -1].price;
        const lastPriceString: string = Number(lastPrice).toFixed(2);

        if (newPriceString != lastPriceString) {
            const newFoodPrice = new FoodPrice();
            newFoodPrice.foodId = foodId;
            newFoodPrice.price = data.price;

            const savedFoodPrice = await this.foodPriceRepository.save(newFoodPrice);
            
            if (!savedFoodPrice) {
                return new ApiResponse('error', -3003, 'Could not save new food price!')
            }
        }

        if (data.features !== null) {
            await this.foodFeatureRepository.remove(existingFood.foodFeatures);

            for(let feature of data.features) {
                let newFoodFeature = new FoodFeature();
                newFoodFeature.foodId = foodId;
                newFoodFeature.featureId = feature.featureId;

                await this.foodFeatureRepository.save(newFoodFeature);
            }
        }

        await this.foodRepository.findOne({where: {foodId: foodId}, 
            relations: ['category', 'foodFeatures', 'foodPrices', 'features']});
    }

    async removeFood(foodId: number): Promise<Food | ApiResponse> {
        const food = await this.foodRepository.findOne({where: {foodId: foodId}});

        if (!food) {
            return new ApiResponse('error', -3001, 'Food not found!');
        }
        
        return await this.foodRepository.remove(food);
    }

    async search(name: string): Promise<Food[] | undefined> {
        const food = await this.foodRepository.find({
            where: {name: Like(`%${name}%`)}
        });
        if (food) {
            return food;
        }
        return undefined;
    }
}