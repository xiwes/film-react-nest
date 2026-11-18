import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { OrderResultDto, TicketDto } from '../order/dto/order.dto';

/**
 * Заказы отдельной таблицы не имеют: забронированные места хранятся
 * в таблице сеансов (schedules.taken) и записываются через FilmsRepository.
 * Здесь формируется подтверждение заказа с идентификатором билета.
 */
@Injectable()
export class OrderRepository {
  async create(item: TicketDto): Promise<OrderResultDto> {
    return { ...item, id: randomUUID() };
  }
}
