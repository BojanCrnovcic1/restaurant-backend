import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from './jwt.service';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      console.error('Authorization header missing');
      return false;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      console.error('Token missing');
      return false;
    }

    try {
      const user = this.jwtService.verify(token);
      if (!user || !roles.includes(user.role)) {
        console.error('Invalid user or role');
        return false;
      }

      request['user'] = user; 
      return true;
    } catch (error) {
      console.error('Token verification failed:', error);
      return false;
    }
  }
}
