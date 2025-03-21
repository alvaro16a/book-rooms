import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Room } from './models/room.model';
import { RoomService } from './room.service';
import { CreateRoomInput, UpdateRoomInput } from './dto/room.dto';


@Resolver(() => Room)
export class RoomResolver {
    constructor(private readonly roomService: RoomService) {}

    @Query(() => [String])
    async getAvailableRoomTypes(): Promise<String[]> {
        return this.roomService.getAvailableRoomTypes();
    }

    @Query(() => [Room])
    async getRooms(): Promise<Room[]> {
        return this.roomService.getRooms();
    }

    @Query(() => Room)
    async getRoomById( @Args('id') id: string ): Promise<Room> {
        return this.roomService.getRoomById(id);
    }

    @Mutation(() => Room)
    async createRoom(@Args('data') data: CreateRoomInput): Promise<Room> {
        return this.roomService.createRoom(data);
    }

    @Mutation(() => Room)
    async updateRoom(@Args('data') data: UpdateRoomInput): Promise<Room> {
        return this.roomService.updateRoom(data);
    }

    @Mutation(() => Boolean)
    async deleteRoom(@Args('id') id: string ): Promise<Boolean> {
        return this.roomService.deleteRoom(id);
    }
}
