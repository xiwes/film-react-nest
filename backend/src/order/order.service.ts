import { Injectable, BadRequestException } from '@nestjs/common';
import { OrderRepository } from '../repository/order.repository';
import { FilmsRepository } from '../repository/films.repository';
import { CreateOrderDto, OrderListDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly filmsRepository: FilmsRepository,
  ) {}

  async createOrder(order: CreateOrderDto): Promise<OrderListDto> {
    const createdItems = [];

    for (const ticket of order.tickets) {
      const session = await this.filmsRepository.findSession(
        ticket.film,
        ticket.session,
      );
      if (!session) {
        throw new BadRequestException(
          `Session ${ticket.session} not found for film ${ticket.film}`,
        );
      }

      const seatKey = `${ticket.row}:${ticket.seat}`;
      if (session.taken.includes(seatKey)) {
        throw new BadRequestException(`Seat ${seatKey} is already taken`);
      }

      await this.filmsRepository.addTakenSeat(
        ticket.film,
        ticket.session,
        seatKey,
      );
      const created = await this.orderRepository.create(ticket);
      createdItems.push(created);
    }

    return { total: createdItems.length, items: createdItems };
  }
}
