import { registerEnumType } from "@nestjs/graphql";

export enum RoomType {
    SINGLE = "SINGLE",
    DOUBLE = "DOUBLE",
    PRESIDENTIAL = "PRESIDENTIAL"
}

export enum ReservationStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED"
}

export enum maxGuestsperRoomType {
  SINGLE = 1,
  DOUBLE = 2,
  PRESIDENTIAL = 4
}
