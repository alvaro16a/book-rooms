import { baseValuePerRoomType, maxGuestsPerRoomType, RoomType } from "../../../shared/constants/common";
import { availableRoomsDTO, ChargeDetails, StayEstimation } from "../models/reservation.model";
import { Room } from "@prisma/client";

export function isValidReservationPeriod(startDate: Date, endDate: Date): boolean {
    const todayUTC = new Date();
    todayUTC.setUTCHours(0, 0, 0, 0);
    startDate.setUTCHours(0, 0, 0, 0);
    endDate.setUTCHours(0, 0, 0, 0);
    return !(startDate < todayUTC || endDate <= startDate)
}

export function isValidnumberOfGuests(typeRoom: string, numOfGuests: number): boolean {
    return (0 < numOfGuests && numOfGuests <= maxGuestsPerRoomType[typeRoom] )
}

export function estimateStayDays(
    startDate: Date, 
    endDate: Date
): StayEstimation {
    startDate.setUTCHours(0, 0, 0, 0);
    endDate.setUTCHours(0, 0, 0, 0);
    const totalNights = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    const totalDays = totalNights + 1;
    let weekendNights = 0;

    let firstReservationDay = startDate.getDay();
    for (let i = 0; i < totalNights; i++) {
        const currentDay = (firstReservationDay + i) % 7
        const nextDay = (firstReservationDay + i+1) % 7
        if ((currentDay == 5 && nextDay == 6) || (currentDay == 6 && nextDay == 0)) {
            weekendNights++;
        }
    }
    return { totalDays, totalNights, weekendNights };
}

export function getChargeDetails(
    stayEstimation: StayEstimation,
    roomType: RoomType,
    allInclusive: boolean,
    numberOfGuests: number
): ChargeDetails {
    const { totalNights, weekendNights } = stayEstimation;
    const baseValue = baseValuePerRoomType[roomType];

    const discount = calculateDiscount(totalNights);
    const allInclusiveCharge = calculateAllInclusiveCharge(allInclusive, numberOfGuests, totalNights);
    const baseValueApply = baseValue - discount;
    const weekendIncrement = baseValueApply * weekendNights * 1.2;
    const totalDaysDiscount = discount * totalNights;
    const totalAmount = (totalNights - weekendNights) * baseValueApply + allInclusiveCharge + weekendIncrement;

    return { weekendIncrement, baseValueApply, totalDaysDiscount, totalAmount };
}

function calculateDiscount(totalNights: number): number {
    if (totalNights >= 10) return 30000;
    if (totalNights >= 7) return 20000;
    if (totalNights >= 4) return 10000;
    return 0;
}

function calculateAllInclusiveCharge(allInclusive: boolean, numberOfGuests: number, totalNights: number): number {
    return allInclusive ? numberOfGuests * totalNights * 25000 : 0;
}

export function ChargeDetailsByAllTypes(
    stayEstimation: any, 
    numberOfGuests: number, 
    rooms: any, 
    allInclusive?: boolean
): Record<RoomType, any[]> {
    const {roomPresidential, roomDouble, roomSingle} = rooms
    const results: Record<RoomType, any[]> = {
        [RoomType.PRESIDENTIAL]: [],
        [RoomType.DOUBLE]: [],
        [RoomType.SINGLE]: []
    };

    const roomTypes: { type: RoomType; rooms: Room[] }[] = [
        { type: RoomType.PRESIDENTIAL, rooms: roomPresidential },
        { type: RoomType.DOUBLE, rooms: roomDouble },
        { type: RoomType.SINGLE, rooms: roomSingle }
    ];

    const allInclusiveOptions = allInclusive !== undefined ? [allInclusive] : [true, false];

    roomTypes.forEach(({ type, rooms }) => {
        if (rooms.length > 0) {
            allInclusiveOptions.forEach(allInclus => {
                results[type].push({
                    ...getChargeDetails(stayEstimation, type, allInclus, numberOfGuests),
                    allInclusive: allInclus
                });
            });
        }
    });
    return results;
}

export function infoFromBillingDetails(
    rooms: Record<string, Room[]>,
    billingDetails: Record<RoomType, any[]>,
    stayEstimation: StayEstimation,
    startDate: Date,
    endDate: Date,
    numberOfGuests: number,
): availableRoomsDTO[] {
    const reservations: availableRoomsDTO[] = [];

    Object.entries(rooms).forEach(([roomKey, roomList]) => {
        const roomType = roomKey.replace('room', '').toUpperCase() as RoomType;
        const charges = billingDetails[roomType] || [];

        roomList.forEach((room) => {
            charges.forEach((charge) => {
                reservations.push({
                    startDate,
                    endDate,
                    numberOfGuests,
                    allInclusive: charge.allInclusive,
                    roomId: room.id,
                    externalView: room.externalView,
                    numberOfDays: stayEstimation.totalDays,
                    numberOfNights: stayEstimation.totalNights,
                    weekendIncrement: charge.weekendIncrement,
                    baseValueApply: charge.baseValueApply,
                    totalDaysDiscount: charge.totalDaysDiscount,
                    totalAmount: charge.totalAmount,
                    roomType: room.type
                });
            });
        });
    });

    return reservations;
}


