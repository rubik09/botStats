import { PickType } from "@nestjs/mapped-types";
import { StatsDto } from "./stats.dto";

export class CreateStatsDto extends PickType(StatsDto, [
  "incomingMessagesCount",
  "apiIdClient",
]) {}
