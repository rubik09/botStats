import {Body, Controller, Post, UseGuards} from '@nestjs/common';
import {TelegramConnectService} from "./telegramConnect.service";
import {CreateTelegramConnectionDto} from "./dto/createTelegramConnect.dto";
import {JwtGuard} from "../auth/jwtAuth.guard";

@Controller('telegramConnect')
export class TelegramConnectController {
    constructor(private readonly telegramConnectService: TelegramConnectService) {}

    @Post()
    @UseGuards(JwtGuard)
    async connectToTelegram(@Body() createTelegramConnectionDto: CreateTelegramConnectionDto): Promise<void> {
        return await this.telegramConnectService.connectToTelegram(createTelegramConnectionDto);
    }
}
