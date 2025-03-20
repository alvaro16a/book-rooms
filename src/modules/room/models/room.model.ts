import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Room {
  @Field(() => ID)
  id: string;

  @Field()
  type: string;

  @Field()
  externalView: boolean;
}