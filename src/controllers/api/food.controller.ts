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
import { supabase } from "src/misc/supabse.client";
import { PathURL } from "src/misc/path.url";

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
            storage: multer.memoryStorage(),
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

            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const uniquename = uniqueSuffix + '_' + file.originalname;

            try{
                const {data, error} = await supabase.storage.from('images').upload(uniquename, file.buffer);

                if (error) {
                    error.message
                    console.log('error message: ', error.message)
                    return new ApiResponse('error', -10002, 'Supabase upload error.')
                }
                const uploadedUrl = data?.path ? PathURL.url + uniquename:'';
                const uploadPhoto = await this.uploadService.upload(foodId, uploadedUrl)
                return uploadPhoto;
            } catch (error) {
                return new ApiResponse('error', -10001, 'Internal server error');
            }
    } 
/*
    @Post(':id/upload')
    @UseGuards(AuthGuard)
    @Roles('admin')
    @UseInterceptors(
        FileInterceptor('photo', {
            storage: multer.memoryStorage(),
            fileFilter(req, file, cb) {
                const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
                const ext = extname(file.originalname).toLowerCase();
                if (allowedExtensions.includes(ext)) {
                    cb(null, true);
                } else {
                    cb(new Error('Invalid file type'), false);
                }
            },
        })
    )
    async uploadFoodPhoto(
        @Param('id') foodId: number,
        @UploadedFile() file: Express.Multer.File
    ): Promise<ApiResponse | Photo> {
        const food = await this.foodService.getFoodById(foodId);
        if (!food) {
            return new ApiResponse('error', -3001, 'Food not found!');
        }
    
        try {
            const uniqueFilename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
    
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('images') 
                .upload(uniqueFilename, file.buffer, {
                    contentType: file.mimetype,
                    upsert: false, 
                });
    
            if (uploadError) {
                console.error('Supabase upload error:', uploadError.message);
                return new ApiResponse('error', -10001, 'Failed to upload file to storage');
            }
    
            const { data: publicUrlData } = supabase.storage
                .from('images')
                .getPublicUrl(uniqueFilename);
    
            if (!publicUrlData || !publicUrlData.publicUrl) {
                console.error('Error generating public URL');
                return new ApiResponse('error', -10003, 'Failed to generate public URL');
            }
    
            const publicURL = publicUrlData.publicUrl;
            console.log('Uploaded file public URL:', publicURL);
    
            const savedPhoto = await this.uploadService.upload(foodId, publicURL);
            console.log('saved photo: ', savedPhoto);
            return savedPhoto;
        } catch (error) {
            console.error('Unexpected error:', error);
            return new ApiResponse('error', -10002, 'Internal server error');
        }
    }
    

    @Post(':id/upload')
    @UseGuards(AuthGuard)
    @Roles('admin')
    @UseInterceptors(
        FileInterceptor('photo', {
            storage: multer.memoryStorage(),
            limits: { fileSize: 10 * 1024 * 1024 }, // Maksimalna veličina fajla 5MB
            fileFilter(req, file, cb) {
                const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
                if (allowedMimeTypes.includes(file.mimetype)) {
                    cb(null, true);
                } else {
                    cb(new Error('Invalid file type'), false);
                }
            },
        })
    )
    async uploadFoodPhoto(
        @Param('id') foodId: number,
        @UploadedFile() file: Express.Multer.File
    ): Promise<ApiResponse | Photo> {
        if (isNaN(foodId)) {
            return new ApiResponse('error', -3002, 'Invalid food ID');
        }
    
        const food = await this.foodService.getFoodById(foodId);
        if (!food) {
            return new ApiResponse('error', -3001, 'Food not found!');
        }
    
        try {
            const uniqueFilename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
    
            // Upload fajla u Supabase
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('images')
                .upload(uniqueFilename, file.buffer, {
                    contentType: file.mimetype,
                    upsert: false, // Postoji li konflikt, greška će biti bačena
                });
    
            if (uploadError) {
                console.error('Supabase upload error:', uploadError.message);
                return new ApiResponse('error', -10001, 'Failed to upload file to storage');
            }
    
            // Dobavljanje javnog URL-a
            const publicURL = supabase.storage
                .from('images')
                .getPublicUrl(uniqueFilename)
                .data.publicUrl;
    
            console.log('Uploaded file public URL:', publicURL);
    
            // Čuvanje javnog URL-a u bazi
            const savedPhoto = await this.uploadService.upload(foodId, publicURL);
            return savedPhoto;
        } catch (error) {
            console.error('Unexpected error:', error);
            return new ApiResponse('error', -10002, 'Internal server error');
        }
    }
    */

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