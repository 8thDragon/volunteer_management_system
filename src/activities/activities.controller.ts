import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Res, StreamableFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { Response, Request, Express } from 'express';
// const multer = require('multer')
import { diskStorage, Multer } from 'multer';
import { PdfFileDto } from './dto/pdf-file.dto';
import { ApiConsumes } from '@nestjs/swagger';
import { UploadFileDto } from './dto/upload.dto';
import { editFileName } from 'utilities/editFileName';
import { File } from './entities/file.entity';
import { InjectModel } from '@nestjs/sequelize';
import { createReadStream } from 'fs';
import { join } from 'path';
// import { PdfFile } from './entities/pdfFile.entity';

@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService,
              @InjectModel(File) 
              private fileUpload: typeof File,
              ) {}

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

  // @Post('uploads')
  // @UseInterceptors(FileInterceptor('pdfFile'))
  // async uploadFile(@UploadedFile() file) {
  //   console.log(file)
  // }

  @Get('getOneId/:id')
  getOneActivity(@Param('id') id: string) {
    return this.activitiesService.getOneActivity(+id);
  }

  @Post('fileupload')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('fileName', {
      storage: diskStorage({
        destination: './uploadedFiles/files',
        filename: editFileName,
      }),
    }),
  )
  async uploadFile(
    @Body() uploadFile: UploadFileDto,
    @UploadedFile() fileName: Express.Multer.File,
  ): Promise<any> {
    let fileData = {
      activityId: uploadFile.activityId,
      file_name: fileName.filename,
      file_path: fileName.path,
    }
    console.log('res')
    let saveFile = this.fileUpload.create(fileData)
    return saveFile
    // return this.accountService.uploadPathFileToAccount(response)
  }

  @Get('getFileTest')
  async getFile(@Res() res: Response) {
    let fileUp = await this.fileUpload.findByPk(2)
    const file = createReadStream(join(process.cwd(),fileUp.file_path));
    file.pipe(res);
    res.set({
      // 'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="${fileUp.file_name}"`,
    });
  }
}
