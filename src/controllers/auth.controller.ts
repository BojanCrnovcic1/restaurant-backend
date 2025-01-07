import { Body, Controller, Post, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "src/auth/auth.service";
import { LoginAdminDto } from "src/dtos/administrator/login.admin.dto";
import { LoginUserDto } from "src/dtos/user/login.user.dto";
import { UserRegisterDto } from "src/dtos/user/user.registar.dto";
import { User } from "src/entities/user.entity";
import { ApiResponse } from "src/misc/api.response.class";
import { UserService } from "src/services/user/user.service";

@Controller('auth')
export class AuthController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService
    ) {}

    @Post('/register')
    async registerUser(@Body() data: UserRegisterDto): Promise<User | ApiResponse> {
        return await this.userService.register(data);
    }

    @Post('/login')
    async login(@Body() loginDto: LoginUserDto): Promise<{ token: string, role: string }> {
      const userOrAdmin = await this.authService.validateUser(loginDto.email, loginDto.password) 
        || await this.authService.validateAdmin(loginDto.email, loginDto.password);
  
      if (!userOrAdmin) {
        throw new UnauthorizedException('Invalid credentials');
      }
  
      const isAdmin = userOrAdmin.hasOwnProperty('administratorId');
      const token = isAdmin
        ? await this.authService.loginAdmin(loginDto as LoginAdminDto)
        : await this.authService.loginUser(loginDto);
  
      const role = isAdmin ? 'admin' : 'user';
  
      return { token, role };
    }

}