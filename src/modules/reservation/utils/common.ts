import { maxGuestsperRoomType } from "src/shared/constants/common";

export function isValidReservationPeriod(startDate: Date, endDate: Date): boolean {
    const todayUTC = new Date();
    todayUTC.setUTCHours(0, 0, 0, 0);
    startDate.setUTCHours(0, 0, 0, 0);
    endDate.setUTCHours(0, 0, 0, 0);
    return !(startDate < todayUTC || endDate <= startDate)
}

export function isValidnumberOfGuests(typeRoom: string, numOfGuests: number): boolean {
    return (0 < numOfGuests && numOfGuests <= maxGuestsperRoomType[typeRoom] )
}
