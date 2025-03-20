import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RepositoryModule } from 'src/db/repositories/repository.module';
import { RoomResolver } from './room.resolver';

@Module({
  providers: [RoomService, RoomResolver],
  imports: [RepositoryModule],
  exports: [RoomService]
})
export class RoomModule {}
