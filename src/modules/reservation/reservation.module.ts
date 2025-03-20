import { Module } from '@nestjs/common';
import { RepositoryModule } from 'src/db/repositories/repository.module';
import { ReservationResolver } from './reservation.resolver';
import { ReservationService } from './reservation.service';
import { RoomModule } from '../room/room.module';

@Module({
    imports: [RepositoryModule, RoomModule],
    providers: [ReservationResolver, ReservationService]
})
export class ReservationModule {}