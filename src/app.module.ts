import {MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';

import config from './configuration/config';
import {HealthModule} from './health/health.module';
import {AdminsModule} from './admins/admins.module';
import {SessionsModule} from './sessions/sessions.module';
import {StatsModule} from './stats/stats.module';
import {UsersModule} from './users/users.module';
import {TypeOrmModule} from '@nestjs/typeorm';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [config],
        }),
        HealthModule,
        AdminsModule,
        SessionsModule,
        StatsModule,
        UsersModule,
        TypeOrmModule.forRoot(config().POSTGRES_DB_SETTINGS),
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply().exclude('health').forRoutes({path: '*', method: RequestMethod.ALL});
    }
}
