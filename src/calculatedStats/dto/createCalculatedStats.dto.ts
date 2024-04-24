import { OmitType } from '@nestjs/mapped-types';

import { CalculatedStatDto } from './calculatedStat.dto';

export class CreateCalculatedStatsDto extends OmitType(CalculatedStatDto, ['id']) {}
