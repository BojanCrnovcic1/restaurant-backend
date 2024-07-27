import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AddAdministratorDto } from "src/dtos/administrator/add.administrator.dto";
import { Administrator } from "src/entities/administrator.entity";
import { ApiResponse } from "src/misc/api.response.class";
import { Repository } from "typeorm";
import * as crypto from "crypto";
import { EditAdministratorDto } from "src/dtos/administrator/edit.administrator.dto";

@Injectable()
export class AdministratorService {
    constructor(
        @InjectRepository(Administrator) private readonly administratorRepository: Repository<Administrator>,
    ) {}

    async getAllAdmin(): Promise<Administrator[]> {
        return await this.administratorRepository.find();
    }

    async getAdminById(administratorId: number): Promise<Administrator | ApiResponse> {

        const admin = await this.administratorRepository.findOne({where: {administratorId: administratorId}});
        if (!admin) {
            return new ApiResponse('error', -1001, 'Administrator is not found!');
        }
        return admin;
    }

    async getAdminByEmail(email: string): Promise<Administrator | undefined> {
        const admin = await this.administratorRepository.findOne({where: {email: email}});

        if (admin) {
            return admin
        }
        return undefined;
    }

    async addAdmin(adminData: AddAdministratorDto): Promise <Administrator | ApiResponse> {
        const passwordHash = crypto.createHash('sha512');
        passwordHash.update(adminData.password);
        const passwordHashString = passwordHash.digest('hex').toUpperCase();

        const newAdmin = new Administrator();
        newAdmin.email = adminData.email;      
        newAdmin.passwordHash = passwordHashString;

        const savedAdmin = this.administratorRepository.save(newAdmin);
        if (!savedAdmin) {
            return new ApiResponse('error', -1002, 'Administrator not added!')
        }
        return savedAdmin;
    }

    async editAdmin(admin_id: number, adminData: EditAdministratorDto): Promise <Administrator | ApiResponse> {
        const admin = await this.administratorRepository.findOne({where: {administratorId: admin_id}});
        if (!admin) {
            return new ApiResponse('error', -1001, 'Administrator is not found!');
        }

        const passwordHash = crypto.createHash('sha512');
        passwordHash.update(adminData.password);
        const passwordHashString = passwordHash.digest('hex').toUpperCase();

        admin.passwordHash = passwordHashString;

        const editAdmin = this.administratorRepository.save(admin);
        if (!editAdmin) {
            return new ApiResponse('error', -1003, 'The password from the administrator has not changed!')
        }

        return editAdmin;
    }

    async deleteAdmin(administratorId: number): Promise <Administrator | ApiResponse> {
        const admin = await this.administratorRepository.findOne({where: {administratorId: administratorId}});

        if (!admin) {
            return new ApiResponse('error', -1001, 'Administrator is not found!');
        }
        return await this.administratorRepository.remove(admin);
    }
}