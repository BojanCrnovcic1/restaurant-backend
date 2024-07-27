import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';
import { LoginUserDto } from 'src/dtos/user/login.user.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const userLoginDto: LoginUserDto = { email: username, password };
    const user = await this.authService.validateUser(userLoginDto.email, userLoginDto.password);
    if (user) {
      return user;
    }
    
    const adminLoginDto: LoginUserDto = { email: username, password };
    const admin = await this.authService.validateAdmin(adminLoginDto.email, adminLoginDto.password);
    if (admin) {
      return admin;
    }
    
    return null;
  }
}
