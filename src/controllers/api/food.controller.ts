import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { StorageConfig } from "config/storage.config";
import multer from "multer";
import path, { extname } from "path";
import { AuthGuard } from "src/auth/auth.guard";
import { Roles } from "src/auth/roles.decorator";
import { AddFoodDto } from "src/dtos/food/add.food.dto";
import { EditFoodDto } from "src/dtos/food/edit.food.dto";
import { Food } from "src/entities/food.entity";
import { Photo } from "src/entities/photo.entity";
import { ApiResponse } from "src/misc/api.response.class";
import { FoodService } from "src/services/food/food.service";
import { UploadService } from "src/services/food/upload.service";

@Controller('api/food')
export class FoodController {
    constructor(
        private foodService: FoodService,
        private uploadService: UploadService
    ) {}

    @Get()
    getAllFoods(): Promise<Food[]> {
        return this.foodService.getAllFoods();
    }

    @Get(':id')
    getFoodById(@Param('id') foodId: number): Promise<Food | ApiResponse> {
        return this.foodService.getFoodById(foodId);
    }

    @Post('createFood')
    @UseGuards(AuthGuard)
    @Roles('admin')
    createFood(@Body() data: AddFoodDto): Promise<Food | ApiResponse> {
        return this.foodService.createFood(data);
    }

    @Patch(':id/editFood')
    @UseGuards(AuthGuard)
    @Roles('admin')
    editFood(@Param('id') foodId: number, @Body() data: EditFoodDto): Promise<Food | ApiResponse> {
        return this.foodService.editFood(foodId, data);
    }

    @Delete(':id')
    @UseGuards(AuthGuard)
    @Roles('admin')
    deleteFood(@Param('id') foodId: number): Promise<Food | ApiResponse> {
        return this.foodService.removeFood(foodId);
    }

    @Post(':id/upload')
    @UseGuards(AuthGuard)
    @Roles('admin')
    @UseInterceptors(
        FileInterceptor('photo', {
            storage: multer.diskStorage({
                destination: StorageConfig.destination,
                filename: (req, file, cb) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                    const ext = extname(file.originalname).toLowerCase();
                    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
                }
            }),
            fileFilter(req, file, cb) {
                const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
                const ext = extname(file.originalname).toLowerCase();
                if (allowedExtensions.includes(ext)) {
                cb(null, true);
                } 
            },
        })
    )
    async uploadFoodPhoto(@Param('id') foodId: number, @UploadedFile() file: Express.Multer.File): Promise<ApiResponse | Photo> {
            const food =  await this.foodService.getFoodById(foodId);
            if (!food) {
                return new ApiResponse('error', -3001, 'Food not found!');
            }

            try {
                const imagePath = file.path;
                const filename = path.basename(imagePath);

                const uploadPhoto = await this.uploadService.upload(foodId, filename)
                return uploadPhoto;
            } catch (error) {
                return new ApiResponse('error', -10001, 'Internal server error');
            }
    }
    @Delete(':id/removePhoto')
    @UseGuards(AuthGuard)
    @Roles('admin')
    removePhoto(@Param('id') photoId: number): Promise <Photo | ApiResponse> {
        return this.uploadService.deletePhoto(photoId);
    }

    @Get('name')
    @UseGuards(AuthGuard)
    @Roles('admin', 'user')
    async search(@Query('name') name: string): Promise <Food[] | undefined> {
        return await this.foodService.search(name);
    }

}