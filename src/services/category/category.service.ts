import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "src/entities/category.entity";
import { ApiResponse } from "src/misc/api.response.class";
import { Repository } from "typeorm";

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category) private readonly categoryRepository: Repository<Category>
    ) {}

    async allCategory(): Promise <Category[]> {
        return await this.categoryRepository.find({
            relations: ['parentCategory', 'categories', 'foods']
        });
    }

    async getCategoryById(categoryId: number): Promise<Category | ApiResponse> {
        const category = await this.categoryRepository.findOne({where: {categoryId: categoryId}, 
                                relations: ['parentCategory', 'categories', 'foods']});

        if (!category) {
            return new ApiResponse('error', -2001, 'Category not found!')
        }
        return category;
    }

    async createCategory(category: Category): Promise <Category | ApiResponse> {
        const newCategory = this.categoryRepository.create(category);

        if (!newCategory) {
            return new ApiResponse('error', -2002, 'Category is not create!');
        }
        const savedCategory = await this.categoryRepository.save(newCategory);

        if (!savedCategory) {
            return new ApiResponse('error', -2003, 'New category is not created!')
        }

        return savedCategory;
    }

    async updateCategory(categoryId: number, updateCategory: Category): Promise <Category | ApiResponse> {
        try {
            const existingCategory = await this.getCategoryById(categoryId);
            if (!existingCategory) {
                return new ApiResponse('error', -2001, 'Category not found!');
            }
            await this.categoryRepository.update(categoryId, updateCategory);
            return await this.getCategoryById(categoryId);
        } catch (error) {
            return new ApiResponse('error', -2004, 'Failed to update category!');
        }
    }

    async deleteCategory(categoryId: number): Promise <Category | ApiResponse> {
        try {
            const category = await this.categoryRepository.findOne({where: {categoryId}});
            if (!category) {
                return new ApiResponse('error', -2001, 'Category not found!')
            }

            return await this.categoryRepository.remove(category);
        }
        catch(error) {
            return new ApiResponse('error', -10001, 'Internal server error!')
        }
    }
}
