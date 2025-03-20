import { HttpException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ReservationRepository } from 'src/db/repositories/reservation.repository';
import { CreateReservationInput } from './dto/reservation.dto';
import { Reservation } from '@prisma/client';
import { isValidnumberOfGuests, isValidReservationPeriod } from './utils/common';
import { RoomService } from '../room/room.service';

@Injectable()
export class ReservationService {
    constructor(
        private readonly repository:ReservationRepository,
        private readonly roomService: RoomService
    ){}

    async createReservation(newReservation:CreateReservationInput): Promise<Boolean>{
        try {
            const {startDate, endDate, type, numberOfGuests, allInclusive} = newReservation
            if(!isValidReservationPeriod(startDate, endDate)){
                throw new InternalServerErrorException(
                    'the reservation must be for a minimum of one day and not start in the past.'
                );         
            }
            if(!isValidnumberOfGuests(type, numberOfGuests)){
                throw new InternalServerErrorException(
                    'the number of guests is not valid for room type'
                );         
            }

            const room = await this.roomService.getAvailableRoom(
                startDate, 
                endDate, 
                type, 
                newReservation.externalView ?? undefined
            )
            /*
            const newR = {
                status: 'CONFIRMED',
                startDate: startDate,
                endDate: endDate,
                numberOfGuests: numberOfGuests,
                roomId: room.id,
                allInclusive: allInclusive,
                totalPrice: new Decimal,
            }
            return await this.repository.createReservation(newReservation)
            */
           return true;
        } catch (error) {
            Logger.error('Error in ReservationService method createReservation', error);
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException('An error occurred while creating the room');
        }
    }
}
