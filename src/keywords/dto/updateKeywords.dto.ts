import { PartialType, PickType } from '@nestjs/mapped-types';

import { KeywordsDto } from './keywords.dto';

export class UpdateKeywordsDto extends PartialType(PickType(KeywordsDto, ['activity', 'keyword'])) {}
