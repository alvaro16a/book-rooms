import { registerEnumType } from "@nestjs/graphql";

export enum RoomType {
    SINGLE = "SINGLE",
    DOUBLE = "DOUBLE",
    PRESIDENTIAL = "PRESIDENTIAL"
}

export enum maxGuestsPerRoomType {
  SINGLE = 1,
  DOUBLE = 2,
  PRESIDENTIAL = 4
}

export enum baseValuePerRoomType {
  SINGLE = 60000,
  DOUBLE = 100000,
  PRESIDENTIAL = 160000
}


