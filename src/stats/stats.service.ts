import {HttpException, HttpStatus, Injectable, Logger} from '@nestjs/common';
import {UsersService} from "../users/users.service";
import {CreateUserDto} from "../users/dto/createUser.dto";
import {StatsRepository} from "./stats.repository";
import {Stats} from "./entity/stats.entity";
import {UpdateStatsDto} from "./dto/updateStats.dto";

@Injectable()
export class StatsService {
    private readonly logger = new Logger(StatsService.name);
    constructor(
        private readonly statsRepository: StatsRepository,
        private readonly usersService: UsersService,
    ) {
    }

    async getStatsByApiId(apiId: Stats['apiIdClient']): Promise<Stats> {
        this.logger.log(`Trying to get stats by apiId: ${apiId}`);

        const stats = await this.statsRepository.getStatsByApiId(apiId);

        if (!stats) {
            this.logger.error(`stats with apiId: ${apiId} not found`);
            throw new HttpException(`stats with apiId: ${apiId} not found`, HttpStatus.NOT_FOUND);
        }

        this.logger.debug(`stats successfully get`);

        return stats;
    }

    async createStats(apiId: Stats['apiIdClient']): Promise<Stats> {
        this.logger.log(`Trying to create stats by apiId: ${apiId}`);

        const stats = await this.statsRepository.getStatsByApiId(apiId);

        if (stats) {
            this.logger.error(`stats with apiId: ${apiId} already exist`);
            throw new HttpException(`stats with apiId: ${apiId}  already exist`, HttpStatus.BAD_REQUEST);
        }

        const newStats = await this.statsRepository.createStats(apiId);

        this.logger.debug(`stats successfully created`);

        return newStats;
    }

    async updateStatsByApiId(updateStatsDto: UpdateStatsDto, apiId: Stats['apiIdClient']): Promise<number> {
        this.logger.log(`Trying to update stats by apiId: ${apiId}`);

        const userSession = await this.getStatsByApiId(apiId);

        if (!userSession) {
            this.logger.error(`stats with apiId: ${apiId} not found`);
            throw new HttpException(`stats with apiId: ${apiId} not found`, HttpStatus.NOT_FOUND);
        }

        const stats = await this.statsRepository.updateStatsByApiId(updateStatsDto, apiId);

        this.logger.debug(`stats successfully updated`);

        return stats;
    }

    async increaseIncomingMessagesCountToSessionByApiId(apiId: Stats['apiIdClient']): Promise<number> {
        this.logger.log(`Trying to increase incoming messages count by apiId: ${apiId}`);

        const userSession = await this.getStatsByApiId(apiId);

        if (!userSession) {
            this.logger.error(`stats with apiId: ${apiId} not found`);
            throw new HttpException(`stats with apiId: ${apiId} not found`, HttpStatus.NOT_FOUND);
        }

        const stats = await this.statsRepository.increaseIncomingMessagesCountToSessionByApiId(apiId);

        this.logger.debug(`incoming messages count successfully increased`);

        return stats;
    }

    async increaseOutgoingMessagesCountToSessionByApiId(apiId: Stats['apiIdClient']): Promise<number> {
        this.logger.log(`Trying to increase outgoing messages count by apiId: ${apiId}`);

        const userSession = await this.getStatsByApiId(apiId);

        if (!userSession) {
            this.logger.error(`stats with apiId: ${apiId} not found`);
            throw new HttpException(`stats with apiId: ${apiId} not found`, HttpStatus.NOT_FOUND);
        }

        const stats = await this.statsRepository.increaseOutgoingMessagesCountToSessionByApiId(apiId);

        this.logger.debug(`outgoing messages count successfully increased`);

        return stats;
    }

    async incomingMessages(clientInfoStr: string): Promise<void> {
        this.logger.log(`Trying to add incoming message to stats`);

        this.logger.log(`parsing clientInfoStr`);
        const clientInfoObj = JSON.parse(clientInfoStr);
        const {apiId, telegramId} = clientInfoObj;

        const createUserDto: CreateUserDto = <CreateUserDto>{
            telegramId,
            apiIdClient: apiId,
        };

        const user = await this.usersService.getUserByApiIdAndTelegramId(createUserDto);

        if (!user) await this.usersService.createUser(createUserDto);

        const stats = await this.getStatsByApiId(apiId);

        if (!stats) await this.createStats(apiId);

        await this.increaseIncomingMessagesCountToSessionByApiId(apiId);

        this.logger.debug(`incoming message successfully add to stats`);
    };
}
