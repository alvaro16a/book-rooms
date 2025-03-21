import { CreateReservationInput } from "src/modules/reservation/dto/reservation.dto";
import { RoomType } from "../src/shared/constants/common";
import { Reservation, Room } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { ReservationDTO } from "src/modules/reservation/models/reservation.model";

export const mockCreateReservationInput: CreateReservationInput = {
    startDate: new Date('2025-04-15T00:00:00.000Z'),
    endDate: new Date('2025-04-18T00:00:00.000Z'),
    numberOfGuests: 1,
    type: RoomType.SINGLE,
    allInclusive: false
}

export const mockRoom: Room = {
    id: "401",
    type: "SINGLE",
    externalView: false
}

export const mockReservation: Reservation = {
    id: "9d58a204-fa3f-4893-8d6e-779931ad0cb4",
    status: "PENDING",
    startDate: new Date('2025-04-15T00:00:00.000Z'),
    endDate: new Date('2025-04-18T00:00:00.000Z'),
    numberOfGuests: 1,
    roomId: "401",
    allInclusive: false,
    createdAt: new Date('2025-03-22T00:00:00.000Z'),
    updatedAt: new Date('2025-03-22T00:00:00.000Z'),
    numberOfDays: 4,
    numberOfNights: 3,
    weekendIncrement: new Decimal(0),
    baseValueApply: new Decimal(60000),
    totalDaysDiscount: new Decimal(0),
    totalAmount: new Decimal(180000)
}

export const mockReservationDTO = {
    id: "9d58a204-fa3f-4893-8d6e-779931ad0cb4",
    status: "PENDING",
    startDate: new Date('2025-04-15T00:00:00.000Z'),
    endDate: new Date('2025-04-18T00:00:00.000Z'),
    numberOfGuests: 1,
    roomId: "401",
    allInclusive: false,
    createdAt: new Date('2025-03-22T00:00:00.000Z'),
    updatedAt: new Date('2025-03-22T00:00:00.000Z'),
    numberOfDays: 4,
    numberOfNights: 3,
    weekendIncrement: 0,
    baseValueApply: 60000,
    totalDaysDiscount: 0,
    totalAmount: 180000,
  }