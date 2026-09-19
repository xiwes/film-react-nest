import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { OrderResultDto, TicketDto } from '../order/dto/order.dto';

@Injectable()
export class OrderRepository {
  private orders: OrderResultDto[] = [];

  create(item: TicketDto): OrderResultDto {
    const newItem: OrderResultDto = { ...item, id: randomUUID() };
    this.orders.push(newItem);
    return newItem;
  }

  findAll(): OrderResultDto[] {
    return this.orders;
  }
}
