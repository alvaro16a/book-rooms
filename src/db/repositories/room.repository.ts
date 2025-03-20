import { HttpException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Room, RoomType } from '.prisma/client';
import { UpdateRoomInput } from 'src/modules/room/dto/room.dto';

@Injectable()
export class RoomRepository {

    constructor(private prismaService: PrismaService){}

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
            if (error.code === 'P2025') {
                throw new NotFoundException(`Room with id ${room.id} not found`);
            }
            Logger.error('Error in RoomRepository method updateRoom', error);
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
            if (error.code === 'P2025') {
                throw new NotFoundException(`Room with id ${id} not found`);
            }
    
            Logger.error('Error in RoomRepository method deleteRoom', error);
            throw new InternalServerErrorException('An error occurred when deleting the room');
        }
    }

    async getAvailableRoom(
        startReservation: Date, 
        endReservation: Date, 
        roomType: RoomType, 
        externalView?: boolean
    ): Promise<Room>{
        try {
            const room = await this.prismaService.room.findFirst({
                where: {
                    type: roomType,
                    externalView: externalView ?? undefined,
                    reservations: {
                        none: { 
                            AND: [
                              { startDate: { lt: endReservation } }, 
                              { endDate: { gt: startReservation } }  
                            ]   
                        }
                    }
                }
            })     
            
            if(!room) {
                throw new NotFoundException(
                    'No rooms are available that satisfy all reservation requirements. Please modify your criteria or select alternative dates'
                );
            }
            return room;
        } catch (error) {
            Logger.error('Error in RoomRepository method getAvailableRoom', error);
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException('An error occurred when consulting the room');
        } 
    }
}
