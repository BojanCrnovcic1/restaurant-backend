import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "./jwt.service";
import { UserService } from "src/services/user/user.service";
import * as bcrypt from "bcrypt";
import { LoginUserDto } from "src/dtos/user/login.user.dto";
import { User } from "src/entities/user.entity";
import { Request } from "express";
import { AdministratorService } from "src/services/administrator/administrator.service";
import { Administrator } from "src/entities/administrator.entity";
import { LoginAdminDto } from "src/dtos/administrator/login.admin.dto";

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
        private readonly adminService: AdministratorService,
    ) {}

    async validateUser(email: string, password: string): Promise<User | null> {
        const user = await this.userService.getUserEmail(email);

        if(user && bcrypt.compare(password, user.passwordHash)) {
            return user;
        }
        return null;
    }

    async validateAdmin(email: string, password: string): Promise<Administrator | null> {        
        const admin = await this.adminService.getAdminByEmail(email);
        
        if (admin && bcrypt.compare(password, admin.passwordHash)) {
            return admin;
        }
        return null;
    }

    async loginUser(login: LoginUserDto): Promise<string> {
        const user = await this.validateUser(login.email, login.password);
        if (!user) {
          throw new UnauthorizedException('Invalid credentials');
        }
        const payload = { userId: user.userId, email: user.email, role: 'user' };
        return this.jwtService.sign(payload);
      }
    
      async loginAdmin(login: LoginAdminDto): Promise<string> {
        const admin = await this.validateAdmin(login.email, login.password);
        if (!admin) {
          throw new UnauthorizedException('Invalid credentials');
        }
        const payload = { adminId: admin.administratorId, email: admin.email, role: 'admin' };
        return this.jwtService.sign(payload);
      }

      async getCurrentUser(req: Request) {
        return req['user'];
      }
}