import {IsInt, IsNumber, Length} from "class-validator";

export class CreateStatsDto {
    @IsNumber()
    readonly incoming_messages_count: number;

    @IsInt()
    @Length(5, 11)
    readonly api_id_client: number;
}
