import { PickType } from "@nestjs/mapped-types";
import { TelegramConnectDto } from "./telegramConnect.dto";

export class DeleteTelegramConnectDto extends PickType(TelegramConnectDto, [
  "id",
]) {}
