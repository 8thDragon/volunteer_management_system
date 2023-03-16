import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { Response, Request, Express } from 'express';
// const multer = require('multer')
import { Multer } from 'multer';
import { PdfFileDto } from './dto/pdf-file.dto';
import { PdfFile } from './entities/pdfFile.entity';

@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post('createActivity')
  async createActivity(@Body() createActivityDto : CreateActivityDto) {
    return this.activitiesService.createActivity(createActivityDto);
  }

  @Patch(':id')
  updateActivity(@Param('id') id: string, 
                @Body() updateActivityDto: UpdateActivityDto) {
    return this.activitiesService.updateActivity(+id, updateActivityDto);
  }

  @Post('upload_pdf')
  @UseInterceptors(FileInterceptor('pdfFile', {
  }))
  async uploadPdf(@UploadedFile() file: any) {
    console.log(file.buffer)
    const pdf = await this.activitiesService.uploadPdf(file.buffer);
    return { id: pdf.id };
  }

  @Post('uploads')
  @UseInterceptors(FileInterceptor('pdfFile'))
  async uploadFile(@UploadedFile() file) {
    console.log(file)
  }
}
