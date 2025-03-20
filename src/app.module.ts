import { Module } from '@nestjs/common';
import { PrismaModule } from './db/prisma/prisma.module';
import { RepositoryModule } from './db/repositories/repository.module';
import { RoomModule } from './modules/room/room.module';
import { ReservationModule } from './modules/reservation/reservation.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,  // Genera el schema automáticamente
    }),
    PrismaModule, 
    RepositoryModule, 
    RoomModule, 
    ReservationModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
