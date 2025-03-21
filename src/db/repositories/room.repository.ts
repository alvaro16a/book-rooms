import { HttpException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Room, RoomType } from '.prisma/client';
import { UpdateRoomInput } from 'src/modules/room/dto/room.dto';

@Injectable()
export class RoomRepository {

    constructor(private prismaService: PrismaService){}

    
    async getAvailableRoomTypes(): Promise<String[]>{
        try {
            const existingRooms = await this.prismaService.room.findMany({
                distinct: ['type'],
                select: { type: true }
            })
        return existingRooms.map(room => room.type);
        } catch (error) {
            Logger.error('Error in RoomRepository method getAvailableRoomTypes', error);
            throw new InternalServerErrorException('An error occurred when consulting the available rooms');
        } 
    }

    async getRooms(): Promise<Room[]>{
        try {
            return await this.prismaService.room.findMany()
        } catch (error) {
            Logger.error('Error in RoomRepository method getRooms', error);
            throw new InternalServerErrorException('An error occurred when consulting the rooms');
        } 
    }

    async getRoomById(id: string): Promise<Room>{
        try {
            const room = await this.prismaService.room.findUnique({
                where: {
                    id
                }     
            })
            if(!room) {
                throw new NotFoundException(`Room with ID: ${id} not found`);
            }
            return room;
        } catch (error) {
            Logger.error('Error in RoomRepository method getRoomById', error);
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException('An error occurred when consulting the room');
        } 
    }

    async createRoom(roomData: Omit<Room, 'id'>): Promise<Room>{
        try {
            return await this.prismaService.room.create({
                data: roomData,     
            }) 
        } catch (error) {
            Logger.error('Error in RoomRepository method createRoom', error);
            throw new InternalServerErrorException('An error occurred while creating the room');
        } 
    }

    async updateRoom(room: UpdateRoomInput): Promise<Room>{
        try {
            return await this.prismaService.room.update({
                where: { id: room.id },
                data: { ...room, id: undefined }    
            })

        } catch (error) {
            Logger.error('Error in RoomRepository method updateRoom', error);
            if (error.code === 'P2025') {
                throw new NotFoundException(`Room with id ${room.id} not found`);
            }
            throw new InternalServerErrorException('An error occurred when updating the room');
        } 
    }

    async deleteRoom(id: string):  Promise<boolean> {
        try {
            await this.prismaService.room.delete({
                where: { id },
            });
            return true;
        } catch (error) {
            Logger.error('Error in RoomRepository method deleteRoom', error);
            if (error.code === 'P2025') {
                throw new NotFoundException(`Room with id ${id} not found`);
            }
            throw new InternalServerErrorException('An error occurred when deleting the room');
        }
    }

    async getAvailableRoom(
        startReservation: Date, 
        endReservation: Date, 
        roomType: RoomType, 
        externalView?: boolean
    ): Promise<Room | null>{
        try {
            const room = await this.prismaService.room.findFirst({
                where: {
                    type: roomType,
                    externalView,
                    reservations: {
                        none: { 
                            AND: [
                              { startDate: { lt: endReservation } }, 
                              { endDate: { gt: startReservation } },
                              { status: { not: 'CANCELLED' } }  
                            ]   
                        }
                    }
                }
            })     
            return room;
        } catch (error) {
            Logger.error('Error in RoomRepository method getAvailableRoom', error);
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(
                'Database error while fetching available rooms. Please try again later.'
            );
        } 
    }
}
