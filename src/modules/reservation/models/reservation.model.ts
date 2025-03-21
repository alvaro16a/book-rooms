import { Field, ID, ObjectType } from "@nestjs/graphql";
import { ReservationStatus } from "@prisma/client";
import { Room } from "src/modules/room/models/room.model";

@ObjectType()
export class ReservationDTO {
  @Field(() => ID)
  id: string;

  @Field()
  status: string;

  @Field()
  startDate: Date;

  @Field()
  endDate: Date;

  @Field()
  numberOfGuests: number;

  @Field()
  allInclusive: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field()
  roomId: string;

  @Field()
  numberOfDays: number;

  @Field()
  numberOfNights: number;

  @Field()
  weekendIncrement: number;

  @Field()
  baseValueApply: number;

  @Field()
  totalDaysDiscount: number;

  @Field()
  totalAmount: number;

  @Field(() => Room, { nullable: true })
  room?: Room;
  
}

@ObjectType()
export class availableRoomsDTO {
  @Field(() => ID, { nullable: true })
  id?: string;

  @Field()
  startDate: Date;

  @Field()
  endDate: Date;

  @Field()
  numberOfGuests: number;

  @Field()
  allInclusive: boolean;

  @Field()
  roomId: string;

  @Field()
  roomType: string;

  @Field()
  externalView: boolean;

  @Field()
  numberOfDays: number;

  @Field()
  numberOfNights: number;

  @Field()
  weekendIncrement: number;

  @Field()
  baseValueApply: number;

  @Field()
  totalDaysDiscount: number;

  @Field()
  totalAmount: number;

  @Field({ nullable: true })
  status?: string;

  @Field(() => Date, { nullable: true })
  createdAt?: Date;

  @Field(() => Date, { nullable: true })
  updatedAt?: Date;

}

export interface StayEstimation {
  totalDays: number;
  totalNights: number;
  weekendNights: number;
}

export interface ChargeDetails {
  weekendIncrement: number;
  baseValueApply: number;
  totalDaysDiscount: number;
  totalAmount: number;
}