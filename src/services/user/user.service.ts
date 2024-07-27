import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRegisterDto } from "src/dtos/user/user.registar.dto";
import { User } from "src/entities/user.entity";
import { ApiResponse } from "src/misc/api.response.class";
import { Repository } from "typeorm";
import * as crypto from "crypto";
import { UpdateUserDto } from "src/dtos/user/update.user.dto";

@Injectable() 
export class UserService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ) {}

    async getAllUsers(): Promise<User[]> {
        return this.userRepository.find();
    }

    async getUserById(userId: number): Promise<User | ApiResponse> {
        const user = await this.userRepository.findOne({where: {userId: userId}});

        if (!user) {
            return new ApiResponse('error', -5001, 'User not found!');
        }
        return user;
    }

    async getUserEmail(email: string): Promise<User | undefined> {
        const user = await this.userRepository.findOne({where: {email: email}});

        if (user) {
            return user
        }

        return undefined;
    }

    async register(data: UserRegisterDto): Promise<User | ApiResponse> {
    
        const passwordHash = crypto.createHash('sha512');
        passwordHash.update(data.password);
        const passwordHashString = passwordHash.digest('hex').toUpperCase();

        const newUser = new User();
        newUser.email = data.email;
        newUser.passwordHash = passwordHashString;
        newUser.forename = data.forename;
        newUser.surname = data.surname;
        newUser.phoneNumber = data.phoneNumber;
        newUser.postalAddress = data.postalAddress;

        const savedUser = await this.userRepository.save(newUser);

        if (!savedUser) {
            return new ApiResponse('error', -5003, 'This user account cannot be created.')
        }
        return savedUser;
    }

    async editUser(userId: number, data: UpdateUserDto): Promise <User | ApiResponse> {
        const user = await this.userRepository.findOne({where: {userId: userId}});
        if (!user) {
            return new ApiResponse('error', -5001, 'User not found!');
        }

        const passwordHash = crypto.createHash('sha512');
        passwordHash.update(data.password);
        const passwordHashString = passwordHash.digest('hex').toUpperCase();

        user.email = data.email;
        user.passwordHash = passwordHashString;
        user.forename = data.forename;
        user.surname = data.surname;
        user.phoneNumber = data.phoneNumber;
        user.postalAddress = data.postalAddress;

        const savedUser = await this.userRepository.save(user);
        if (!savedUser) {
            return new ApiResponse('error', -5004, 'No user data has been changed.')
        }
        return savedUser;
    }

    async deleteUser(userId: number): Promise<User | ApiResponse> {
        const user = await this.userRepository.findOne({where: {userId: userId}});
        if (!user) {
            return new ApiResponse('error', -5001, 'User not found!');
        }
        return await this.userRepository.remove(user);
    }
}