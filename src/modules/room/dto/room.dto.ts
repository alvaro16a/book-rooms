import { Field, InputType } from "@nestjs/graphql";
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { RoomType } from "src/shared/constants/common";



@InputType()
export class CreateRoomInput {
    @IsNotEmpty()
    @IsEnum(RoomType)
    @Field({
        description: 'room types'
    })
    type: RoomType;

    @IsNotEmpty()
    @IsBoolean()
    @Field({
        description: 'room has a view to the outside'
    })
    externalView: boolean;
}

@InputType()
export class UpdateRoomInput {
    @IsNotEmpty()
    @IsString()
    @Field({
        description: 'id of room'
    })
    id: string;

    @IsOptional()
    @IsEnum(RoomType)
    @Field({
        description: 'room types',
        nullable: true
    })
    type?: RoomType;

    @IsOptional()
    @IsBoolean()
    @Field({
        description: 'room has a view to the outside',
        nullable: true
    })
    externalView?: boolean;
}