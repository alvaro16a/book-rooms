import { BadRequestException, HttpException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { ReservationRepository } from '../../db/repositories/reservation.repository';
import { CreateReservationInput, GetAvailableRoomsInput } from './dto/reservation.dto';
import { ReservationStatus, Room } from '@prisma/client';
import { ChargeDetailsByAllTypes, estimateStayDays, getChargeDetails, infoFromBillingDetails, isValidnumberOfGuests, isValidReservationPeriod } from './utils/common';
import { RoomService } from '../room/room.service';
import { ChargeDetails, ReservationDTO, StayEstimation } from './models/reservation.model';
import { Decimal } from '@prisma/client/runtime/library';
import { RoomType } from '../../shared/constants/common';

@Injectable()
export class ReservationService {
    constructor(
        private readonly repository:ReservationRepository,
        private readonly roomService: RoomService
    ){}

    async getReservationById(id: string): Promise<ReservationDTO>{
        try {
            const respoReservation = await this.repository.getReservation(id)
            return {
                ...respoReservation,
                weekendIncrement: respoReservation.weekendIncrement.toNumber(),
                baseValueApply: respoReservation.baseValueApply.toNumber(),
                totalDaysDiscount: respoReservation.totalDaysDiscount.toNumber(),
                totalAmount: respoReservation.totalAmount.toNumber()
            }  
        } catch (error) {
            Logger.error('Error in ReservationService method getReservationById', error);
            throw error;
        }  
    }
    
    async getReservations(): Promise<ReservationDTO[]>{
        try {
            const reservations = await this.repository.getReservations();
            return reservations.map(respoReservation => ({
                ...respoReservation,
                weekendIncrement: respoReservation.weekendIncrement.toNumber(),
                baseValueApply: respoReservation.baseValueApply.toNumber(),
                totalDaysDiscount: respoReservation.totalDaysDiscount.toNumber(),
                totalAmount: respoReservation.totalAmount.toNumber()
                })
            ) 
        } catch (error) {
            Logger.error('Error in ReservationService method getReservations', error);
            throw error;
        }
        
    }

    async createReservation(newReservation:CreateReservationInput): Promise<ReservationDTO>{
        try {
            const {startDate, endDate, type, numberOfGuests, allInclusive,externalView} = newReservation
            if(!isValidReservationPeriod(startDate, endDate)){
                throw new BadRequestException(
                    'the reservation must be for a minimum of one day and not start in the past.'
                );         
            }
            if(!isValidnumberOfGuests(type, numberOfGuests)){
                throw new BadRequestException(
                    'the number of guests is not valid for room type'
                );         
            }
            const room = await this.roomService.getAvailableRoom(
                startDate, 
                endDate, 
                type, 
                externalView ?? undefined
            )
            if(!room) {
                throw new NotFoundException(
                    'No rooms are available that satisfy all reservation requirements. Please modify your criteria or select alternative dates'
                );
            }
            const stayEstimation: StayEstimation = estimateStayDays(startDate, endDate)
            const billingDetails: ChargeDetails = getChargeDetails(
                stayEstimation,
                type,
                allInclusive,
                numberOfGuests
            )
 
            const reservation = {
                startDate: startDate,
                endDate: endDate,
                numberOfGuests: numberOfGuests,
                allInclusive: allInclusive,
                status: "CONFIRMED" as ReservationStatus,
                roomId: room.id,
                numberOfDays: stayEstimation.totalDays,
                numberOfNights: stayEstimation.totalNights,
                weekendIncrement: new Decimal(billingDetails.weekendIncrement),
                baseValueApply: new Decimal(billingDetails.baseValueApply),
                totalDaysDiscount: new Decimal(billingDetails.totalDaysDiscount),
                totalAmount: new Decimal(billingDetails.totalAmount)
            }
            const respoReservation = await this.repository.createReservation(reservation)
            return {
                ...respoReservation,
                weekendIncrement: respoReservation.weekendIncrement.toNumber(),
                baseValueApply: respoReservation.baseValueApply.toNumber(),
                totalDaysDiscount: respoReservation.totalDaysDiscount.toNumber(),
                totalAmount: respoReservation.totalAmount.toNumber()
            }
        } catch (error) {
            Logger.error('Error in ReservationService method createReservation',
                error instanceof Error ? error.message : error
            );
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(
                'An error occurred while creating the reservation'
            );
        }
    }

    async cancelReservation(id: string): Promise<ReservationDTO>{
        try {
            const respoReservation = await this.repository.cancelReservation(id);
            return {
                ...respoReservation,
                weekendIncrement: respoReservation.weekendIncrement.toNumber(),
                baseValueApply: respoReservation.baseValueApply.toNumber(),
                totalDaysDiscount: respoReservation.totalDaysDiscount.toNumber(),
                totalAmount: respoReservation.totalAmount.toNumber()
            } 
        } catch (error) {
            Logger.error('Error in ReservationService method cancelReservation', error);
            throw error;
        }
    }

    async getAvailableRooms(availableRooms:GetAvailableRoomsInput){
        try {
            const {startDate, endDate, type, numberOfGuests, allInclusive, externalView} = availableRooms
            if(!isValidReservationPeriod(startDate, endDate)){
                throw new BadRequestException(
                    'the reservation must be for a minimum of one day and not start in the past.'
                );         
            }

            if (numberOfGuests > 4){
                throw new InternalServerErrorException(
                    'the number of guests is not valid for any type of room.'
                );
            }
            const rooms = await this.getRoomsByAllTypes(numberOfGuests, startDate, endDate, externalView)
            const stayEstimation: StayEstimation = estimateStayDays(startDate, endDate)
            

            const billingDetails = ChargeDetailsByAllTypes(
                stayEstimation, 
                numberOfGuests,
                rooms,
                allInclusive)
            return infoFromBillingDetails(
                rooms, 
                billingDetails, 
                stayEstimation, 
                startDate, 
                endDate, 
                numberOfGuests,
            );

        } catch (error) {
            Logger.error('Error in ReservationService method createReservation', error);
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException('An error occurred while creating the room');
        }
    }

    async  getRoomsByAllTypes(
        numberOfGuests: number, 
        startDate: Date, 
        endDate: Date, 
        externalView?: boolean
    ): Promise<{ roomPresidential: Room[], roomDouble: Room[], roomSingle: Room[] }> {
        try {
            const views = externalView !== undefined ? [externalView] : [true, false];
            const roomTypes: RoomType[] = [];
        
            if (numberOfGuests > 2) {
                roomTypes.push(RoomType.PRESIDENTIAL);
            } else if (numberOfGuests > 1) {
                roomTypes.push(RoomType.PRESIDENTIAL, RoomType.DOUBLE);
            } else {
                roomTypes.push(RoomType.PRESIDENTIAL, RoomType.DOUBLE, RoomType.SINGLE);
            }
            const roomPresidential: Room[] = [];
            const roomDouble: Room[] = [];
            const roomSingle: Room[] = [];
            for (const view of views) {
                for (const type of roomTypes) {
                    const room = await this.roomService.getAvailableRoom(startDate, endDate, type, view);
                    if (room == null) continue
                    if (type === 'PRESIDENTIAL') {
                        roomPresidential.push(room);
                    } else if (type === 'DOUBLE') {
                        roomDouble.push(room);
                    } else if (type === 'SINGLE') {
                        roomSingle.push(room);
                    }
                }
            }
            return { roomPresidential, roomDouble, roomSingle }; 
        } catch (error) {
            Logger.error('Error in ReservationService method getRoomsByAllTypes',
                error instanceof Error ? error.message : error
            );
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(
                'An error occurred while getRoomsByAllTypes'
            );
        }
    }
        
}

