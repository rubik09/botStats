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

    async createStats(apiIdClient: Stats['apiIdClient']): Promise<Stats> {
        return await this.statsRepository.save({apiIdClient});
    }

    async updateStatsByApiId(updateStatsDto: UpdateStatsDto, apiIdClient: Stats['apiIdClient']): Promise<number> {
        const {affected} = await this.statsRepository.update({apiIdClient}, updateStatsDto);
        return affected;
    }

    async increaseIncomingMessagesCountToSessionByApiId(apiIdClient: Stats['apiIdClient']): Promise<number> {
        const {affected} = await this.statsRepository.increment({apiIdClient}, 'incomingMessagesCount', 1);
        return affected;
    }

    async increaseOutgoingMessagesCountToSessionByApiId(apiIdClient: Stats['apiIdClient']): Promise<number> {
        const {affected} = await this.statsRepository.increment({apiIdClient}, 'outgoingMessagesCount', 1);
        return affected;
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

    async deleteStatsByApiId(deleteStatsDto: DeleteStatsDto): Promise<number> {
        const {affected} = await this.statsRepository.delete(deleteStatsDto);
        return affected;
    }
}
