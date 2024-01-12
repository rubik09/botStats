import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Stats} from "./entity/stats";
import {CreateStatDto} from "./dto/createStat.dto";
import {UpdateStatDto} from "./dto/updateStat.dto";

@Injectable()
export class StatsRepository {
    constructor(
        @InjectRepository(Stats)
        private readonly statsRepository: Repository<Stats>,
    ) {
    }

    async addStats(createStatDto: CreateStatDto): Promise<void> {
        await this.statsRepository.insert(createStatDto);
    }

    async updateClientStats(updateStatDto: UpdateStatDto): Promise<void> {
        await this.statsRepository.update({apiIdClient: updateStatDto.apiIdClient}, updateStatDto);
    }

    async updateIncomingMessagesCountToSessionByApiId(apiIdClient: number): Promise<void> {
        await this.statsRepository.increment({apiIdClient}, 'incoming_messages_count', 1);
    }

    async getStatsByApiId(apiIdClient: number): Promise<Stats> {
        return await this.statsRepository.findOne({where: {apiIdClient}});
    }

    async getClientStats(apiIdClient: number): Promise<Stats> {
        return await this.statsRepository.findOne({where: {apiIdClient}});
    }

    async getCountStats(apiIdClient: number): Promise<Stats> {
        return await this.statsRepository.findOne({where: {apiIdClient}, select: ['usersCount']});
    }
}
