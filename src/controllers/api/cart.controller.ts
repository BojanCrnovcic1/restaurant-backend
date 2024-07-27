import { Body, Controller, Get, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { AuthGuard } from "src/auth/auth.guard";
import { Roles } from "src/auth/roles.decorator";
import { AddFoodToCartDto } from "src/dtos/cart/add.food.to.cart.dto";
import { EditFoodInCartDto } from "src/dtos/cart/edit.food.in.cart.dto";
import { Cart } from "src/entities/cart.entity";
import { Order } from "src/entities/order.entity";
import { ApiResponse } from "src/misc/api.response.class";
import { CartService } from "src/services/cart/cart.service";
import { OrderMailer } from "src/services/order/order.mailer.service";
import { OrderService } from "src/services/order/order.service";

@Controller('api/cart')
export class CartController {
    constructor(
        private readonly cartService: CartService,
        private readonly orderService: OrderService,
        private readonly orderMailer: OrderMailer,
    ) {}

    private async getActiveCartForUserId(userId: number): Promise<Cart> {
        let cart = await this.cartService.getLastActiveCartByUserId(userId);
        if (!cart) {
            cart = await this.cartService.createNewCartForUser(userId);
        }
        return await this.cartService.getCartById(cart.cartId);
    }

    @Get()
    @UseGuards(AuthGuard)
    @Roles('admin', 'user')
    async getCurrentCart(@Req() req: Request): Promise<Cart> {
        return await this.getActiveCartForUserId(req.user.userId);
    }

    @Post('addToCart')
    @UseGuards(AuthGuard)
    @Roles('user')
    async addToCart(@Body() data: AddFoodToCartDto, @Req() req: Request): Promise<Cart> {
        const cart = await this.getActiveCartForUserId(req.user.userId);
        return await this.cartService.addFoodsToCart(cart.cartId, data.foodId, data.quantity);
    }

    @Patch()
    @UseGuards(AuthGuard)
    @Roles('user')
    async changeQuantity(@Body() data: EditFoodInCartDto, @Req() req: Request): Promise<Cart> {
        const cart = await this.getActiveCartForUserId(req.user.userId);
        return await this.cartService.changeQuentity(cart.cartId, data.foodId, data.quantity);
    }

    @Post('makeOrder')
    @UseGuards(AuthGuard)
    @Roles('user')
    async makeOrder(@Req() req: Request): Promise<Order | ApiResponse> {
        const cart = await this.getActiveCartForUserId(req.user.userId);
        const order = await this.orderService.add(cart.cartId);

        if (order instanceof ApiResponse) {
            return order;
        }

        await this.orderMailer.sendOrderEmail(order)

        return order;
    }

    @Get('orders')
    @UseGuards(AuthGuard)
    @Roles('user')
    async getOrders(@Req() req: Request): Promise<Order[]> {
        return await this.orderService.getAllByUserId(req.user.userId);
    }
}