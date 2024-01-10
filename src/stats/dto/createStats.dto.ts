import {IsNumber, IsString, Length} from "class-validator";

export class CreateStatsDto {
    @IsNumber()
    readonly incoming_messages_count: number;

    @IsString()
    @Length(5, 11)
    readonly api_id_client: string;
}
