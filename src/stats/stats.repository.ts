import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Stats} from "./entity/stats.entity";
import {CreateStatsDto} from "./dto/createStats.dto";
import {UpdateStatsDto} from "./dto/updateStats.dto";
import {DeleteStatsDto} from "./dto/deleteStats.dto";

@Injectable()
export class StatsRepository {
    constructor(
        @InjectRepository(Stats)
        private readonly statsRepository: Repository<Stats>,
    ) {
    }

    async createStats(createStatsDto: CreateStatsDto): Promise<void> {
        await this.statsRepository.insert(createStatsDto);
    }

    async updateClientStatsByApiId(updateStatsDto: UpdateStatsDto, apiIdClient: Stats['apiIdClient']): Promise<void> {
        await this.statsRepository.update({apiIdClient}, updateStatsDto);
    }

    async increaseIncomingMessagesCountToSessionByApiId(apiIdClient: Stats['apiIdClient']): Promise<void> {
        await this.statsRepository.increment({apiIdClient}, 'incoming_messages_count', 1);
    }

    async getStatsByApiId(apiIdClient: Stats['apiIdClient']): Promise<Stats> {
        return await this.statsRepository.findOne({where: {apiIdClient}});
    }

    async getClientStatsByApiId(apiIdClient: Stats['apiIdClient']): Promise<Stats> {
        return await this.statsRepository.findOne({where: {apiIdClient}});
    }

    async getCountStatsByApiId(apiIdClient: Stats['apiIdClient']): Promise<Stats> {
        return await this.statsRepository.findOne({where: {apiIdClient}, select: ['usersCount']});
    }

    async deleteStatsByApiId(deleteStatsDto: DeleteStatsDto): Promise<void> {
        await this.statsRepository.delete(deleteStatsDto);
    }
}
