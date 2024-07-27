import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CartFood } from "src/entities/cart-food.entity";
import { Cart } from "src/entities/cart.entity";
import { Repository } from "typeorm";

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(Cart) private readonly cartRepository: Repository<Cart>,
        @InjectRepository(CartFood) private readonly cartFoodRepository: Repository<CartFood>
    ) {}

    async getLastActiveCartByUserId(userId: number): Promise<Cart | null> {
        const carts = await this.cartRepository.find({
            where: {
                userId: userId
            },
            order: {
                createdAt: 'DESC'
            },
            take: 1,
            relations: ['order', 'cartFoods', 'cartFoods.food']
        });

        if (!carts || carts.length === 0) {
            return null;
        }

        const cart = carts[0];

        if (cart.order !== null) {
            return null;
        }

        return cart;
    }

    async createNewCartForUser(userId: number): Promise<Cart> {
        const newCart = new Cart();
        newCart.userId = userId;
        return await this.cartRepository.save(newCart);
    }

    async addFoodsToCart(cartId: number, foodId: number, quantity: number): Promise<Cart> {
        let record: CartFood = await this.cartFoodRepository.findOne({
            where: { cartId: cartId, foodId: foodId}
        });

        if (!record) {
            record = new CartFood();
            record.cartId = cartId,
            record.foodId = foodId,
            record.quantity = quantity
        } else {
            record.quantity += quantity;
        }

        await this.cartFoodRepository.save(record);
        return this.getCartById(cartId);
    }

    async getCartById(cartId: number): Promise<Cart> {
        return await this.cartRepository.findOne({
            where: {cartId: cartId},
            relations: [
                "user",
                "cartFoods",
                "cartFoods.food",
                "cartFoods.food.category",
                "cartFoods.food.foodPrices"
            ]
        });
    }

    async changeQuentity(cartId: number, foodId: number, quantity: number): Promise<Cart> {
        let record: CartFood = await this.cartFoodRepository.findOne({
            where: {cartId: cartId, foodId: foodId}
        });

        if (record) {
            record.quantity = quantity;

            if (record.quantity === 0) {
                await this.cartFoodRepository.delete(record.cartFoodId);
            } else {
                await this.cartFoodRepository.save(record);
            }
        }

        return await this.getCartById(cartId);
    }
}