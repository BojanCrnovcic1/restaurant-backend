import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { MailConfig } from "config/mail.config";
import { CartFood } from "src/entities/cart-food.entity";
import { Order } from "src/entities/order.entity";

@Injectable()
export class OrderMailer {
    constructor(
        private readonly mailerService: MailerService,
    ) {}

    async sendOrderEmail(order: Order): Promise<boolean> {
        try {
            await this.mailerService.sendMail({
                to: order.cart.user.email,
                bcc: MailConfig.orderNotificationMail,
                subject: 'Order details',
                encoding: 'UTF-8',
                html: this.makeOrderHtml(order),
            });
            return true;

        } catch (err) {
            return false;
        }
    }

    private makeOrderHtml(order: Order): string {
        let suma = order.cart.cartFoods.reduce((sum, current: CartFood) => {
            return sum +
                   current.quantity *
                   current.food.foodPrices[current.food.foodPrices.length-1].price
        }, 0);

        return `<p>Thank you for your order!</p>
                <p>These are the details of your order:</p>
                <ul>
                    ${ order.cart.cartFoods.map((cartFood: CartFood) => {
                        return `<li>
                            ${ cartFood.food.name } x
                            ${ cartFood.quantity }
                        </li>`;
                    }).join("") }
                </ul>
                <p>The total amount is:${ suma.toFixed(2) } EUR.</p>
                <p>Potpis...</p>`;
    }
}