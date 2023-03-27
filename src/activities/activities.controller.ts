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
import { createReadStream, createWriteStream, readFileSync } from 'fs';
import { join } from 'path';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import { UserActivity } from 'src/user-activities/entities/user-activity.entity';
import { UpdateUserActivityDto } from 'src/user-activities/dto/update-user-activity.dto';
// import { PdfFile } from './entities/pdfFile.entity';

@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService,
              @InjectModel(File) 
              private fileUpload: typeof File,
              @InjectModel(UserActivity) 
              private userActivity: typeof UserActivity,
              ) {}

  @Post('createActivity')
  async createActivity(@Body() createActivityDto : CreateActivityDto) {
    return this.activitiesService.createActivity(createActivityDto);
  }

  @Patch('update_activity/:id')
  updateActivity(@Param('id') id: string, 
                @Body() updateActivityDto: UpdateActivityDto) {
    return this.activitiesService.updateActivity(+id, updateActivityDto);
  }

  @Patch('finish_activity')
  finishActivity(@Body() updateUserActivityDto: UpdateUserActivityDto) {
    return this.activitiesService.finishActivity(updateUserActivityDto)
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

  @Get('getoneid/:id')
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

  // @Get('getFileTest')
  // async getFile(@Res() res: Response) {
  //   let fileUp = await this.fileUpload.findByPk(4)
  //   const file = createReadStream(join(process.cwd(),fileUp.file_path));
  //   console.log(fileUp.file_path, '+++++++++++++++++')
  //   const filePath = join(process.cwd(), fileUp.file_path);
  //   console.log(filePath, '22222222222222222')

  //   const pdfBytes = this.modifyPdf(filePath, 'Hello World!');

  //   console.log(fileUp.file_path, '33333333333333333')
  //   // file.pipe(res);
  //   res.set({
  //     // 'Content-Type': 'application/json',
  //     'Content-Disposition': `attachment; filename="${fileUp.file_name}"`,
  //     'Content-Type': 'application/pdf',
  //   });

  //   res.send(pdfBytes)
  // }

  // async modifyPdf(filePath: string, text: string) {
  //   const existingPdfBytes = await createReadStream(filePath).read();
  
  //   if (existingPdfBytes === null) {
  //     throw new Error('PDF file is null or undefined.');
  //   }
  
  //   const pdfDoc = await PDFDocument.load(existingPdfBytes);
  //   const [firstPage] = pdfDoc.getPages();
  //   const { width, height } = firstPage.getSize();
  
  //   const font = await pdfDoc.embedFont('Helvetica');
  
  //   firstPage.drawText(text, {
  //     x: width / 2,
  //     y: height / 2,
  //     size: 50,
  //     font,
  //     opacity: 0.5,
  //   });
  
  //   const pdfBytes = await pdfDoc.save();
  //   await createWriteStream(filePath).write(pdfBytes);
  
  //   return pdfBytes;
  // }

  // @Get('getFileTest')
  // async getFile(@Res() res: Response) {
  //   let fileUp = await this.fileUpload.findByPk(2)
  //   const fileStream = createReadStream(join(process.cwd(),fileUp.file_path));
  //   const pdfDoc = await PDFDocument.load(fileStream);

  //   // Add a watermark to each page
  //   const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  //   const pages = pdfDoc.getPages();
  //   for (const page of pages) {
  //     const { width, height } = page.getSize();
  //     const text = 'CONFIDENTIAL';
  //     const textSize = font.widthOfTextAtSize(text, 50);
  //     const centerX = width / 2;
  //     const centerY = height / 2;
  //     page.drawText(text, {
  //       x: centerX - textSize / 2,
  //       y: centerY,
  //       size: 50,
  //       font: font,
  //       opacity: 0.5,
  //     });
  //   }

  //   // Stream the modified PDF to the response
  //   const pdfBytes = await pdfDoc.save();
  //     fileStream.pipe(res);
  //     res.set({
  //       // 'Content-Type': 'application/json',
  //       'Content-Disposition': `attachment; filename="${fileUp.file_name}"`,
  //     });
  //   }
}
