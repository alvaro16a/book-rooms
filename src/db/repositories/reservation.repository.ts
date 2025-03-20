import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Reservation } from '@prisma/client';

@Injectable()
export class ReservationRepository {
    constructor(private prismaService: PrismaService){}

    async getReservations(): Promise<Reservation[]>{
        try {
            return await this.prismaService.reservation.findMany()
        } catch (error) {
            Logger.error('Error in ReservationRepository method getRooms', error);
            throw new InternalServerErrorException('An error occurred when consulting the rooms');
        } 
    }

    async getReservation(id: string): Promise<Reservation>{
        try {
            const reservation = await this.prismaService.reservation.findUnique({
                where: {
                    id
                }     
            })
            if(!reservation) {
                throw new NotFoundException(`Reservation with ID: ${id} not found`);
            }
            return reservation;
        } catch (error) {
            Logger.error('Error in ReservationRepository method getReservation', error);
            throw new InternalServerErrorException('An error occurred when consulting the reservation');
        } 
    }

    async createReservation(reservationData: Omit<Reservation, 'id'>): Promise<Reservation>{
        try {
            return await this.prismaService.reservation.create({
                data: reservationData,     
            }) 
        } catch (error) {
            Logger.error('Error in ReservationRepository method createReservation', error);
            throw new InternalServerErrorException('An error occurred while creating the reservation');
        } 
    }
}
