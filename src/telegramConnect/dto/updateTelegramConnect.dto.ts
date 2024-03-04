import { PartialType, PickType } from "@nestjs/mapped-types";
import { TelegramConnectDto } from "./telegramConnect.dto";

export class UpdateTelegramConnectDto extends PartialType(
  PickType(TelegramConnectDto, ["keywords", "status"]),
) {}
