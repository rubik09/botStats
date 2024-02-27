import {Body, Controller, Post} from '@nestjs/common';
import {TelegramConnectService} from "./telegramConnect.service";
import {CreateTelegramConnectionDto} from "./dto/createTelegramConnect.dto";

@Controller('telegramConnect')
export class TelegramConnectController {
    constructor(private readonly telegramConnectService: TelegramConnectService) {}

    @Post('')
    // @UseGuards(JwtGuard)
    async connectToTelegram(@Body() createTelegramConnectionDto: CreateTelegramConnectionDto) {
        return await this.telegramConnectService.connectToTelegram(createTelegramConnectionDto);
    }
}
