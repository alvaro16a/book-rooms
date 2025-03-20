import { Module } from '@nestjs/common';
import { RoomRepository } from './room.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { ReservationRepository } from './reservation.repository';

@Module({
  providers: [RoomRepository, ReservationRepository],
  imports: [PrismaModule],
  exports:[RoomRepository, ReservationRepository]
})
export class RepositoryModule {}
