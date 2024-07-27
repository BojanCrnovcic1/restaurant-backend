import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Food } from "src/entities/food.entity";
import { Photo } from "src/entities/photo.entity";
import { ApiResponse } from "src/misc/api.response.class";
import { Repository } from "typeorm";

@Injectable()
export class UploadService {
    constructor(
        @InjectRepository(Photo) private readonly photoRepository: Repository<Photo>,
        @InjectRepository(Food) private readonly foodRepository: Repository<Food>,
    ) {}

    async upload(foodId: number, photo: string): Promise <Photo | ApiResponse> {

        const food = await this.foodRepository.findOne({where: {foodId: foodId}});
        if (!food) {
            return new ApiResponse('error', -3001, 'Food not found!');
        }
        const newPhoto = new Photo();
        newPhoto.foodId = food.foodId,
        newPhoto.imagePath = photo;

        const savedPhoto = await this.photoRepository.save(newPhoto);

        if (!savedPhoto) {
            return new ApiResponse('error', -3101, 'Image  is not saved!')
        }
        return savedPhoto;
    }

    async deletePhoto(photoId: number): Promise <Photo | ApiResponse> {
        const photo = await this.photoRepository.findOne({where: {photoId: photoId}});
        if (!photo) {
            return new ApiResponse('error', -3102, 'Image not found!')
        }
        return await this.photoRepository.remove(photo);
    }
}