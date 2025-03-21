import { HttpException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { Room } from '@prisma/client';
import { RoomRepository } from '../../db/repositories/room.repository';
import { CreateRoomInput, UpdateRoomInput } from './dto/room.dto';
import { RoomType } from 'src/shared/constants/common';

@Injectable()
export class RoomService {
    constructor(
        private readonly roomRepository: RoomRepository
    ){}

    
    async getAvailableRoomTypes(): Promise<String[]>{
        try {
            return await this.roomRepository.getAvailableRoomTypes();  
        } catch (error) {
            Logger.error('Error in roomService method getAvailableRoomTypes', error);
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException('An error occurred while consulting the room types');
        } 
    }

    async getRooms(): Promise<Room[]>{
        try {
            return await this.roomRepository.getRooms();
        } catch (error) {
            Logger.error('Error in roomService method getRooms', error);
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException('An error occurred while consulting the rooms');
        } 
    }

    async getRoomById(id: string): Promise<Room>{
        try {
            return await this.roomRepository.getRoomById(id);
        } catch (error) {
            Logger.error('Error in roomService method getRoomById', error);
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException('An error occurred while consulting the rooms by Id');
        }
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
        try {
            return await this.roomRepository.deleteRoom(id);
        } catch (error) {
            Logger.error('Error in roomService method deleteRoom', error);
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException('An error occurred while deleting a room by id');
        }
        
    }

    async getAvailableRoom(
            startDate: Date, 
            endDate: Date, 
            roomType: RoomType, 
            externalView?: boolean
    ): Promise<Room | null>{
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
            throw new InternalServerErrorException('An error occurred while consulting the room');
        }
    }
}
