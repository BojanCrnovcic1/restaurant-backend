import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfig } from 'config/database.config';
import { Administrator } from './entities/administrator.entity';
import { CartFood } from './entities/cart-food.entity';
import { Cart } from './entities/cart.entity';
import { Category } from './entities/category.entity';
import { Feature } from './entities/feature.entity';
import { FoodPrice } from './entities/food-price.entity';
import { Food } from './entities/food.entity';
import { Order } from './entities/order.entity';
import { Photo } from './entities/photo.entity';
import { User } from './entities/user.entity';
import { AdministratorController } from './controllers/api/administrator.controller';
import { CategoryController } from './controllers/api/category.controller';
import { FoodController } from './controllers/api/food.controller';
import { FeatureController } from './controllers/api/feature.controller';
import { AdministratorService } from './services/administrator/administrator.service';
import { CategoryService } from './services/category/category.service';
import { FoodService } from './services/food/food.service';
import { FeatureService } from './services/feature/feature.service';
import { UserService } from './services/user/user.service';
import { AuthController } from './controllers/auth.controller';
import { AuthMiddleware } from './auth/auth.middleware';
import { AuthGuard } from './auth/auth.guard';
import { AuthService } from './auth/auth.service';
import { JwtStrategy } from './auth/jwt.strategy';
import { JwtService } from './auth/jwt.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtSecret } from 'config/jwt.secret';
import { UploadService } from './services/food/upload.service';
import { CartService } from './services/cart/cart.service';
import { CartController } from './controllers/api/cart.controller';
import { OrderService } from './services/order/order.service';
import { OrderMailer } from './services/order/order.mailer.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailConfig } from 'config/mail.config';
import { OrderController } from './controllers/api/order.controller';
import { FoodFeature } from './entities/food-feature.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: DatabaseConfig.host,
      port: 3306,
      username: DatabaseConfig.username,
      password: DatabaseConfig.password,
      database: DatabaseConfig.database,
      entities: [
        Administrator,
        CartFood,
        Cart,
        Category,
        Feature,
        FoodFeature,
        FoodPrice,
        Food,
        Order,
        Photo,
        User
      ],
      synchronize: false
    }),
    TypeOrmModule.forFeature([
      Administrator,
      CartFood,
      Cart,
      Category,
      Feature,
      FoodFeature,
      FoodPrice,
      Food,
      Order,
      Photo,
      User
    ]),
    JwtModule.register({
      secret: jwtSecret,
      signOptions: { expiresIn: '1h' },
    }),
    MailerModule.forRoot({
      transport: 'smtps://' + MailConfig.username + ':' + MailConfig.password + '@' + MailConfig.hostname,
      defaults: {
        from: MailConfig.senderEmail
      }
    })
  ],
  controllers: [
    AppController,
    AdministratorController,
    CategoryController,
    FoodController,
    FeatureController,
    AuthController,
    CartController,
    OrderController,
  ],
  providers: [
    AdministratorService,
    CategoryService,
    FoodService,
    FeatureService,
    UserService,
    JwtService,
    AuthGuard,
    AuthService,
    JwtStrategy,
    UploadService,
    CartService,
    OrderService,
    OrderMailer,
  ],
  exports: [
    AdministratorService,
    UserService, 
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
     consumer.apply(AuthMiddleware)
             .exclude('auth/*')
             .forRoutes('api/*')
  }
}
