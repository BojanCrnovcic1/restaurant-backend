import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/auth/auth.guard";
import { Roles } from "src/auth/roles.decorator";
import { Category } from "src/entities/category.entity";
import { ApiResponse } from "src/misc/api.response.class";
import { CategoryService } from "src/services/category/category.service";

@Controller('api/category') 
export class CategoryController {
    constructor(
        private categoryService: CategoryService
    ) {}

    @Get()
    getAllCategory(): Promise<Category[]> {
        return this.categoryService.allCategory();
    }

    @Get(':id')
    getCategoryById(@Param('id') categoryId: number): Promise<Category | ApiResponse> {
        return this.categoryService.getCategoryById(categoryId);
    }

    @Post()
    @UseGuards(AuthGuard)
    @Roles('admin')
    createNewCategory(@Body() categroy: Category): Promise <Category | ApiResponse> {
        return this.categoryService.createCategory(categroy);
    }

    @Patch(':id')
    @UseGuards(AuthGuard)
    @Roles('admin')
    updateCategory(@Param('id') categoryId: number, @Body() category: Category): Promise <Category | ApiResponse> {
        return this.categoryService.updateCategory(categoryId, category);
    }

    @Delete(':id')
    @UseGuards(AuthGuard)
    @Roles('admin')
    deleteCategory(@Param('id') categoryId: number): Promise <Category | ApiResponse> {
        return this.categoryService.deleteCategory(categoryId);
    }
}