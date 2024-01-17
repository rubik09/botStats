import {MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';

import {BotModule} from './bot/bot.module';
import config from './configuration/config';
import {HealthModule} from './health/health.module';
import {UpdatesModule} from './updates/updates.module';
import {AdminsModule} from './admins/admins.module';
import {UserSessionModule} from './userSession/userSession.module';
import {StatsModule} from './stats/stats.module';
import {UsersModule} from './users/users.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import { PersonalInfoModule } from './personalInfo/personalInfo.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [config],
        }),
        HealthModule,
        UpdatesModule,
        BotModule,
        AdminsModule,
        UserSessionModule,
        StatsModule,
        UsersModule,
        TypeOrmModule.forRoot(config().POSTGRES_DB_SETTINGS),
        PersonalInfoModule,
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply().exclude('health').forRoutes({path: '*', method: RequestMethod.ALL});
    }
}
