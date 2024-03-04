import { setupSteps } from "./consts";
import { CreateTelegramConnectionDto } from "../telegramConnect/dto/createTelegramConnect.dto";

export type TSetupSteps = {
  [key in setupSteps]: (
    createTelegramConnectionDto: CreateTelegramConnectionDto,
  ) => Promise<void>;
};
