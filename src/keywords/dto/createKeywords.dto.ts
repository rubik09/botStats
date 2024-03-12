import { PickType } from '@nestjs/mapped-types';
import {KeywordsDto} from "./keywords.dto";


export class CreateKeywordsDto extends PickType(KeywordsDto, ['activity', 'keyword', 'userSession']) {}
