import { HttpException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { Room } from '@prisma/client';
import { RoomRepository } from 'src/db/repositories/room.repository';
import { CreateRoomInput, UpdateRoomInput } from './dto/room.dto';
import { RoomType } from 'src/shared/constants/common';

@Injectable()
export class RoomService {
    constructor(
        private readonly roomRepository: RoomRepository
    ){}

    async getRooms(): Promise<Room[]>{
            return await this.roomRepository.getRooms();
    }

    async getRoomById(id: string): Promise<Room>{
        return await this.roomRepository.getRoomById(id);
    }

    async createRoom(createRoom:CreateRoomInput): Promise<Room>{
        try {
            return await this.roomRepository.createRoom(createRoom)
        } catch (error) {
            Logger.error('Error in roomService method createRoom', error);
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException('An error occurred while creating the room');
        }
    }

    async updateRoom(updateRoom:UpdateRoomInput): Promise<Room>{
        try {
            return await this.roomRepository.updateRoom(updateRoom)
        } catch (error) {
            Logger.error('Error in roomService method updateRoom', error);
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException('An error occurred while updating the room');
        }
    }
    async deleteRoom(id: string){
        return await this.roomRepository.deleteRoom(id);
    }

    async getAvailableRoom(
            startDate: Date, 
            endDate: Date, 
            roomType: RoomType, 
            externalView?: boolean
    ): Promise<Room>{
        try {
            return await this.roomRepository.getAvailableRoom(
                startDate, 
                endDate, 
                roomType, 
                externalView
            ); 
        } catch (error) {
            Logger.error('Error in roomService method getAvailableRoom', error);
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException('an error occurred while consulting the room');
        }
        
    }
}
