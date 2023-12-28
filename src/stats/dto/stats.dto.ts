import {IsString, IsNumber} from 'class-validator';

export class CreateStatsDto {
    @IsNumber()
    readonly incoming_messages_count: number;

    @IsString()
    readonly api_id_client: string;
}

export class UpdateStatsDto {
    @IsNumber()
    readonly incoming_messages_count: number;

    @IsNumber()
    readonly users_count: number;
}
