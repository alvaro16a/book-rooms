import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { availableRoomsDTO, ReservationDTO } from './models/reservation.model';
import { ReservationService } from './reservation.service';
import { CreateReservationInput, GetAvailableRoomsInput } from './dto/reservation.dto';

@Resolver(() => ReservationDTO)
export class ReservationResolver {
    constructor(
        private readonly reservationService: ReservationService
    ){}
    @Query(() => [ReservationDTO])
    async getReservations(): Promise<ReservationDTO[]> {
        return this.reservationService.getReservations();
    }

    @Query(() => ReservationDTO)
    async getReservationById( @Args('id') id: string ): Promise<ReservationDTO> {
        return this.reservationService.getReservationById(id);
    }

    @Query(() => [availableRoomsDTO])
    async getAvailableRooms(@Args('data') data: GetAvailableRoomsInput): Promise<availableRoomsDTO[]> {
        return this.reservationService.getAvailableRooms(data);
    }

    @Mutation(() => ReservationDTO)
    async createReservation(@Args('data') data: CreateReservationInput): Promise<ReservationDTO> {
        return this.reservationService.createReservation(data);
    }

    @Mutation(() => ReservationDTO)
    async cancelReservation(@Args('id') id: string ): Promise<ReservationDTO> {
        return this.reservationService.cancelReservation(id);
    }
}
