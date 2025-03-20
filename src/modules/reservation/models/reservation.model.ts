import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Room } from "src/modules/room/models/room.model";
import { ReservationStatus } from "src/shared/constants/common";

@ObjectType()
export class Reservation {
  @Field(() => ID)
  id: string;

  @Field(() => ReservationStatus)
  status: ReservationStatus;

  @Field()
  startDate: Date;

  @Field()
  endDate: Date;

  @Field()
  numberOfGuests: number;

  @Field()
  allInclusive: boolean;

  @Field()
  totalPrice: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => Room)
  room: Room;
}