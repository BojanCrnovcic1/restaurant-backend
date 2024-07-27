import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Cart } from "src/entities/cart.entity";
import { Order } from "src/entities/order.entity";
import { ApiResponse } from "src/misc/api.response.class";
import { Repository } from "typeorm";

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order) private readonly orderRepository: Repository<Order>,
        @InjectRepository(Cart) private readonly  cartRepository: Repository<Cart>
    ) {}

    async add(cartId: number): Promise<Order | ApiResponse> {
        const order = await this.orderRepository.findOne({ where: { cartId: cartId} });

        if (order) {
            return new ApiResponse("error", -7001, "An order for this cart has already been made.");
        }

        const cart = await this.cartRepository.findOne({
            where: {cartId: cartId},
            relations: [ "cartFoods"]
        });

        if (!cart) {
            return new ApiResponse('error', -7002, 'No such cart found.');
        }

        if (cart.cartFoods.length === 0) {
            return new ApiResponse('error', -7003, 'This cart is empty.')
        }

        const newOrder = new Order();
        newOrder.cartId = cartId;
        const savedOrder = await this.orderRepository.save(newOrder);

        cart.createdAt = new Date();
        await this.cartRepository.save(cart)

        return await this.getById(savedOrder.orderId);

    }

    async getById(orderId: number) {
        return await this.orderRepository.findOne({
            where: {orderId: orderId},
            relations: [
                "cart",
                "cart.user",
                "cart.cartFoods",
                "cart.cartFoods.food",
                "cart.cartFoods.food.category",
                "cart.cartFoods.food.foodPrices"
            ]
        });
    }

    async getAllByUserId(userId: number) {
        return await this.orderRepository.find({
            where: { cartId : userId},
            relations: [
                "cart",
                "cart.user",
                "cart.cartFoods",
                "cart.cartFoods.food",
                "cart.cartFoods.food.category",
                "cart.cartFoods.food.foodPrices"
            ]
        });
    }

    async getAll() {
        return await this.orderRepository.find({
            relations: [
                "cart",
                "cart.user",
                "cart.cartFoods",
                "cart.cartFoods.food",
                "cart.cartFoods.food.category",
                "cart.cartFoods.food.foodPrices"
            ]
        });
    }

    async changeStatus(orderId: number, newStatus: "rejected" | "accepted" | "shipped" | "pending") {
        const order = await this.getById(orderId);

        if (!order) {
            return new ApiResponse("error", -9001, "No such order found!");
        }

        order.status = newStatus;

        await this.orderRepository.save(order);

        return await this.getById(orderId);
    }
}