import { Field, InputType } from "@nestjs/graphql";
import { IsBoolean, IsDate, IsEnum, IsInt, IsNotEmpty, IsOptional, Min, Validate } from "class-validator";
import { RoomType } from "src/shared/constants/common";

@InputType()
export class CreateReservationInput {
    @IsNotEmpty()
    @IsDate()
    @Field({
        description: 'Reservation start date'
    })
    startDate: Date;

    @IsNotEmpty()
    @IsDate()
    @Field({
        description: 'Reservation end date'
    })
    endDate: Date;

    @IsNotEmpty()
    @IsInt()
    @Min(1)
    @Field({
        description: 'Number of guests for the reservation'
    })
    numberOfGuests: number;

    @IsNotEmpty()
    @IsEnum(RoomType)
    @Field({
        description: 'room types'
    })
    type: RoomType;

    @IsNotEmpty()
    @IsBoolean()
    @Field({
        description: 'Whether the reservation includes all-inclusive service'
    })
    allInclusive: boolean;

    @IsOptional()
    @IsBoolean()
    @Field({
        description: 'room has a view to the outside',
        nullable: true
    })
    externalView?: boolean;
}