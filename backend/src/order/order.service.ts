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

      const dedupeKey = `${ticket.session}:${ticket.row}:${ticket.seat}`;
      if (seenSeats.has(dedupeKey)) {
        throw new BadRequestException(
          `Seat ${ticket.row}:${ticket.seat} is requested more than once in this order`,
        );
      }
      seenSeats.add(dedupeKey);
    }

    const reserved: { film: string; session: string; seatKey: string }[] = [];

    try {
      for (const ticket of order.tickets) {
        const seatKey = `${ticket.row}:${ticket.seat}`;
        const ok = await this.filmsRepository.addTakenSeat(
          ticket.film,
          ticket.session,
          seatKey,
        );
        if (!ok) {
          throw new BadRequestException(`Seat ${seatKey} is already taken`);
        }
        reserved.push({ film: ticket.film, session: ticket.session, seatKey });
      }
    } catch (error) {
      for (const seat of reserved) {
        await this.filmsRepository.releaseTakenSeat(
          seat.film,
          seat.session,
          seat.seatKey,
        );
      }
      throw error;
    }

    const createdItems = [];
    for (const ticket of order.tickets) {
      const created = await this.orderRepository.create(ticket);
      createdItems.push(created);
    }

    return { total: createdItems.length, items: createdItems };
  }
}
