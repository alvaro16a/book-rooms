import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Reservation } from './models/reservation.model';
import { ReservationService } from './reservation.service';
import { CreateReservationInput } from './dto/reservation.dto';

@Resolver(() => Reservation)
export class ReservationResolver {
    constructor(
        private readonly reservationService: ReservationService
    ){}

    @Mutation(() => Boolean)
    async createReservation(@Args('data') data: CreateReservationInput): Promise<Boolean> {
        return this.reservationService.createReservation(data);
    }
}
