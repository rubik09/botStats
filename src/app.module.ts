import {MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';

import config from './configuration/config';
import {HealthModule} from './health/health.module';
import {AdminsModule} from './admins/admins.module';
import {UserSessionModule} from './userSession/userSession.module';
import {StatsModule} from './stats/stats.module';
import {UsersModule} from './users/users.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {PersonalInfoModule} from './personalInfo/personalInfo.module';
import {TelegramConnectModule} from './telegramConnect/telegramConnect.module';
import {KafkaModule} from './kafka/kafka.module';
import {VerificationConsumer} from './kafka/verification.consumer';
import {AuthModule} from './auth/auth.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [config],
        }),
        HealthModule,
        AdminsModule,
        UserSessionModule,
        StatsModule,
        UsersModule,
        PersonalInfoModule,
        UserSessionModule,
        TelegramConnectModule,
        TypeOrmModule.forRootAsync({
            useFactory: async (configService: ConfigService) => configService.get('POSTGRES_DB_SETTINGS'),
            inject: [ConfigService],
        }),
        PersonalInfoModule,
        TelegramConnectModule,
        KafkaModule,
        AuthModule,
    ],
    providers: [
        VerificationConsumer
    ]
})

export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply().exclude('health').forRoutes({path: '*', method: RequestMethod.ALL});
    }
}
