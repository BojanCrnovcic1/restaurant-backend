import { Body, Controller, Get, Param, Patch, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/auth/auth.guard";
import { Roles } from "src/auth/roles.decorator";
import { ChangeOrderStatusDto } from "src/dtos/order/change.order.status.dto";
import { Order } from "src/entities/order.entity";
import { ApiResponse } from "src/misc/api.response.class";
import { OrderService } from "src/services/order/order.service";

@Controller('api/admin/order')
export class OrderController {
    constructor(
        private readonly orderService: OrderService
    ) {}

    @Get()
    @UseGuards(AuthGuard)
    @Roles('admin')
    getAll(): Promise<Order[]> {
        return this.orderService.getAll()
    }

    @Get(':id')
    @UseGuards(AuthGuard)
    @Roles('admin')
    getOrderById(@Param('id') orderId: number): Promise<Order> {
        return this.orderService.getById(orderId);
    }

    @Patch(':id')
    @UseGuards(AuthGuard)
    @Roles('admin')
    changeStatus(@Param('id') orderId: number, @Body() data: ChangeOrderStatusDto): Promise<Order | ApiResponse> {
        return this.orderService.changeStatus(orderId, data.newStatus)
    }

}