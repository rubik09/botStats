import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { CronService } from './cron.service';
import { CreateCronJobDto } from './dto/createCronJob.dto';
import { UpdateCronJobDto } from './dto/updateCronJob.dto';
import { CronEntity } from './entity/cron.entity';
import { AuthGuard } from '../auth/auth.guard';
import { Keyword } from '../keywords/entity/keywords.entity';
import { PersonalInfo } from '../personalInfo/entity/personalInfo.entity';

@UseGuards(AuthGuard)
@Controller('cron')
export class CronController {
  constructor(private readonly cronService: CronService) {}

  @Get()
  async getCronJobs(): Promise<CronEntity[]> {
    return this.cronService.getCronJobs();
  }

  @Post()
  async createCronJob(@Body() createCronJobDto: CreateCronJobDto) {
    await this.cronService.createCronJob(createCronJobDto);
    throw new HttpException('Планировщик успешно создан', HttpStatus.CREATED);
  }

  @Patch(':id')
  async updateCronJob(@Param('id') id: Keyword['id'], @Body() updateCronJobDto: UpdateCronJobDto) {
    await this.cronService.updateCronJob(id, updateCronJobDto);
    throw new HttpException('Планировщик успешно изменен', HttpStatus.OK);
  }

  @Delete(':id')
  async deleteCronJob(@Param('id') id: PersonalInfo['id']) {
    await this.cronService.deleteCronJob(id);
    throw new HttpException('Планировщик успешно удален', HttpStatus.OK);
  }
}
