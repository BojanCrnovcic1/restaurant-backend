import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Feature } from "src/entities/feature.entity";
import { ApiResponse } from "src/misc/api.response.class";
import { Repository } from "typeorm";

@Injectable()
export class FeatureService {
    constructor(
        @InjectRepository(Feature) private readonly featureRepository: Repository<Feature>
    ) {}

    async getAllFeatures(): Promise <Feature[]> {
        return await this.featureRepository.find({
            relations: ['foodFeatures', 'foods']});
    }

    async getFeatureById(featureId: number): Promise<Feature | ApiResponse> {
        const feature = await this.featureRepository.findOne({where: {featureId: featureId}, 
                                                     relations: ['foodFeatures', 'foods']});

        if (!feature) {
            return new ApiResponse('error', -4001, 'Feature not found!');
        }
        return feature;
    }

    async createFeature(feature: Feature): Promise<Feature | ApiResponse> {
        const newFeature = this.featureRepository.create(feature);
        
        if (!newFeature) {
            return new ApiResponse('error', -4002, 'Feature is not create!');
        }

        const savedFeature = await this.featureRepository.save(newFeature);

        if (!savedFeature) {
            return new ApiResponse('error', -4003, 'Feature is not saved!');
        }

        return savedFeature;
    }

    async updateFeature(featureId: number, feature: Feature): Promise<Feature | ApiResponse> {
        try {
            const existFeature = this.getFeatureById(featureId);
            if (!existFeature) {
                return new ApiResponse('error', -4001, 'Feature not found!');
            }

            await this.featureRepository.update(featureId, feature);
            return await this.getFeatureById(featureId);
        } catch (error) {
            return new ApiResponse('error', -4004, 'Failed to update category!');
        }
    }

    async deleteFeature(featureId: number): Promise<Feature | ApiResponse> {
        const feature = await this.featureRepository.findOne({where: {featureId: featureId}, 
                                                     relations: ['foodFeatures', 'foods']});

        if (!feature) {
            return new ApiResponse('error', -4001, 'Feature not found!');
        }

        return await this.featureRepository.remove(feature);
    }
}