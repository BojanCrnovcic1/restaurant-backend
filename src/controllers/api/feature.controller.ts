import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/auth/auth.guard";
import { Roles } from "src/auth/roles.decorator";
import { Feature } from "src/entities/feature.entity";
import { ApiResponse } from "src/misc/api.response.class";
import { FeatureService } from "src/services/feature/feature.service";


@Controller('api/feature')
export class FeatureController {
    constructor(
        private featureService: FeatureService
    ) {}

    @Get()
    getAllFeatures(): Promise <Feature[]> {
        return this.featureService.getAllFeatures();
    }

    @Get(':id')
    getFeatureById(@Param('id') featureId: number): Promise <Feature | ApiResponse> {
        return this.featureService.getFeatureById(featureId);
    }

    @Post('createFeature')
    @UseGuards(AuthGuard)
    @Roles('admin')
    createFeautre(@Body() feature: Feature): Promise <Feature | ApiResponse> {
        return this.featureService.createFeature(feature);
    }

    @Patch(':id/editFeature')
    @UseGuards(AuthGuard)
    @Roles('admin')
    updateFeature(@Param('id') featureId: number, @Body() feature: Feature): Promise<Feature | ApiResponse> {
        return this.featureService.updateFeature(featureId,feature);
    }

    @Delete(':id/deleteFeature')
    @UseGuards(AuthGuard)
    @Roles('admin')
    removeFeature(@Param('id') featureId: number): Promise<Feature | ApiResponse> {
        return this.featureService.deleteFeature(featureId);
    }
}