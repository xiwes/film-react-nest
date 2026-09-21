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
    const seenSeats = new Set<string>();

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

      if (
        ticket.row < 1 ||
        ticket.row > session.rows ||
        ticket.seat < 1 ||
        ticket.seat > session.seats
      ) {
        throw new BadRequestException(
          `Seat ${ticket.row}:${ticket.seat} is out of hall bounds`,
        );
      }

      const seatKey = `${ticket.session}:${ticket.row}:${ticket.seat}`;

      if (session.taken.includes(`${ticket.row}:${ticket.seat}`)) {
        throw new BadRequestException(
          `Seat ${ticket.row}:${ticket.seat} is already taken`,
        );
      }

      if (seenSeats.has(seatKey)) {
        throw new BadRequestException(
          `Seat ${ticket.row}:${ticket.seat} is requested more than once in this order`,
        );
      }
      seenSeats.add(seatKey);
    }

    const createdItems = [];
    for (const ticket of order.tickets) {
      const seatKey = `${ticket.row}:${ticket.seat}`;
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