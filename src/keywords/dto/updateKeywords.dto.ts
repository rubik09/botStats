import { PickType } from '@nestjs/mapped-types';
import {KeywordsDto} from "./keywords.dto";


export class UpdateKeywordsDto extends PickType(KeywordsDto, ['activity', 'keyword']) {}
