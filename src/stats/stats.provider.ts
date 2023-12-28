import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {StatsEntity} from "./entity/stats.entity";
import {CreateStatsDto, UpdateStatsDto} from "./dto/stats.dto";

@Injectable()
export class StatsProvider {
    constructor(
        @InjectRepository(StatsEntity)
        private readonly statsRepository: Repository<StatsEntity>,
    ) {
    }

    async addStats(createStatsDto: CreateStatsDto): Promise<void> {
        await this.statsRepository.insert(createStatsDto);
    }

    async updateClientStats(updateStatsDto: UpdateStatsDto, api_id_client: string): Promise<void> {
        await this.statsRepository.update({api_id_client}, updateStatsDto);
    }

    async updateIncomingMessagesCountToSessionByApiId(api_id_client: string): Promise<void> {
        await this.statsRepository.increment({api_id_client}, 'incoming_messages_count', 1);
    }

    async getStatsByApiId(api_id_client: string): Promise<StatsEntity> {
        return this.statsRepository.findOne({where: {api_id_client}});
    }

    async getClientStats(api_id_client: string): Promise<StatsEntity> {
        return this.statsRepository.findOne({where: {api_id_client}});
    }

    async getCountStats(api_id_client: string): Promise<number> {
        const stats = await this.statsRepository.findOne({where: {api_id_client}, select: ['users_count']});
        return stats?.users_count;
    }
}
