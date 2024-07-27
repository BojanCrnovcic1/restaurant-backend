import { Body, Controller, Delete, Get, Param, Patch, Put } from "@nestjs/common";
import { AddAdministratorDto } from "src/dtos/administrator/add.administrator.dto";
import { EditAdministratorDto } from "src/dtos/administrator/edit.administrator.dto";
import { Administrator } from "src/entities/administrator.entity";
import { ApiResponse } from "src/misc/api.response.class";
import { AdministratorService } from "src/services/administrator/administrator.service";


@Controller('api/administrator')
export class AdministratorController {
    constructor(
        private administratorService: AdministratorService,
    ) {}

    @Get()
    allAdmin(): Promise<Administrator[]> {
        return this.administratorService.getAllAdmin();
    }

    @Get(':id')
    adminById(@Param('id') administratorId: number): Promise<Administrator | ApiResponse> {
        return this.administratorService.getAdminById(administratorId);
    }

    @Put()
    addAdmin(@Body() data: AddAdministratorDto): Promise<Administrator | ApiResponse> {
        return this.administratorService.addAdmin(data);
    }

    @Patch(':id')
    editAdmin(@Param('id') administratorId: number, @Body() data: EditAdministratorDto): Promise<Administrator | ApiResponse> {
        return this.administratorService.editAdmin(administratorId,data);
    }

    @Delete(':id')
    removeAdmin(@Param('id') administratorId: number): Promise<Administrator | ApiResponse> {
        return this.administratorService.deleteAdmin(administratorId);
    }
}