import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { randomUUID } from 'node:crypto';
import { Order, OrderDocument } from './schemas/order.schema';
import { OrderResultDto, TicketDto } from '../order/dto/order.dto';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
  ) {}

  async create(item: TicketDto): Promise<OrderResultDto> {
    const newItem = { ...item, id: randomUUID() };
    await this.orderModel.create(newItem);
    return newItem;
  }

  async findAll(): Promise<OrderResultDto[]> {
    return this.orderModel.find().lean().exec();
  }
}
