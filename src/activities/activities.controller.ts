import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Res, Req, StreamableFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { Response, Request, Express, request } from 'express';
import { JwtService } from '@nestjs/jwt';
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
import { PDFDocument, StandardFonts, rgb, degrees } from 'pdf-lib';
import { UserActivity } from 'src/user-activities/entities/user-activity.entity';
import { UpdateUserActivityDto } from 'src/user-activities/dto/update-user-activity.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { CheckUserDto } from 'src/users/dto/check-user.dto';
import { CommentDto } from './dto/commnet.dto';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { CreateUserActivityDto } from 'src/user-activities/dto/create-user-activity.dto';
import { RemoveUserDto } from 'src/users/dto/remove-user.dto';
import { CheckUserActivityDto } from 'src/user-activities/dto/check-user-activity.dto';
import { CronJob } from 'cron';
import { Cron, Interval } from '@nestjs/schedule';
import { NotifyDto } from './dto/notify.dto';
// import { PdfFile } from './entities/pdfFile.entity';

@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService,
              @InjectModel(File) 
              private fileUpload: typeof File,
              @InjectModel(UserActivity) 
              private userActivity: typeof UserActivity,
              ) {
                // new CronJob('* 6 16 * * *', this.activitiesService.startActivity).start();
              }

  @Post('createActivity')
  async createActivity(@Body() createActivityDto : CreateActivityDto,
                      @Req() request: Request) {
    return this.activitiesService.createActivity(createActivityDto,request);
  }

  @Patch('update_activity')
  updateActivity(@Body() updateActivityDto: UpdateActivityDto,
                @Req() request: Request) {
    return this.activitiesService.updateActivity(updateActivityDto,request);
  }

  @Patch('update_activity_status')
  updateActivityStatus(@Body() updateActivityDto: UpdateActivityDto) {
    return this.activitiesService.updateActivityStatus(updateActivityDto);
  }

  @Patch('update_activity_status_toggle')
  updateActivityStatusFromToggle(@Body() updateActivityDto: UpdateActivityDto,
                                @Req() request: Request) {
    return this.activitiesService.updateActivityStatusFromToggle(updateActivityDto,request);
  }

  @Patch('finish_activity')
  finishActivity(@Body() updateUserActivityDto: UpdateUserActivityDto,
                @Req() request: Request) {
    return this.activitiesService.finishActivity(updateUserActivityDto,request)
  }

  @Post('upload_pdf')
  @UseInterceptors(FileInterceptor('pdfFile', {
  }))
  async uploadPdf(@UploadedFile() file: any) {
    console.log(file.buffer)
    const pdf = await this.activitiesService.uploadPdf(file.buffer);
    return { id: pdf.id };
  }

  // @Post('post_comment')
  // async postComment(@Body() commentDto: CommentDto,
  //                   @Req() request: Request) {
  //   return this.activitiesService.postComment(commentDto,request)
  // }

  @Get('get_all_comment')
  async getAllComment() {
    return this.activitiesService.getAllComment()
  }

  @Post('get_comment')
  async getComment(@Body() updateActivityDto: UpdateActivityDto) {
    return this.activitiesService.getComment(updateActivityDto)
  }

  @Post('get_commnet_form_UserAc')
  async getCommentFromUserAc(@Body() commentDto: CommentDto) {
    return this.activitiesService.getCommentFromUserAc(commentDto)
  }

  @Post('get_user_in_userAc')
  async getUserInUserActivity(@Body() updateUserActivityDto: UpdateUserActivityDto,
                              @Req() request: Request) {
    return this.activitiesService.getUserInUserActivity(updateUserActivityDto,request)
  }

  @Patch('remove_user_from_useractivity')
  async removeUserFromUserActivity(@Body() removeUserDto: RemoveUserDto,
                                  @Req() request: Request
                                  ) {
    return this.activitiesService.removeUserFromUserActivity(removeUserDto,request)
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

  @Get('open_activity')
  async getOpenActivity(@Body() updateActivityDto: UpdateActivityDto) {
    return this.activitiesService.getOpenActivity(updateActivityDto)
  }

  @Get('close_activity')
  async getCloseActivity(@Body() updateActivityDto: UpdateActivityDto) {
    return this.activitiesService.getCloseActivity(updateActivityDto)
  }

  @Get('get_all_users')
  async getAllUsers(@Req() request: Request,
                    @Body() createUserDto: CreateUserDto){
    return this.activitiesService.getAllUsers(request,createUserDto)
  }

  @Get('get_lated_activity')
  async getLatedActivity(@Body() createUserActivityDto: CreateUserActivityDto){
    return this.activitiesService.getLatedActivity(createUserActivityDto)
  }

  @Get('get_lated_activity_ended')
  async getLatedActivityEnded(@Body() createUserActivityDto: CreateUserActivityDto){
    return this.activitiesService.getLatedActivityEnded(createUserActivityDto)
  }

  @Patch('update_blacklist')
  async updateBlacklist(@Body() checkUserDto: CheckUserDto,
                        @Req() request: Request) {
    return this.activitiesService.updateBlacklist(checkUserDto,request)
  }

  // @Patch('start_activity')
  // @Interval(10000)
  @Cron('0 0 9 * * *')
  async startActivity() {
    return this.activitiesService.startActivity()
  }

  @Post('get_useractivity_by_id')
  async getUserActivityById(@Body() updateUserActivityDto: UpdateUserActivityDto) {
    return this.activitiesService.getUserActivityById(updateUserActivityDto)
  }

  @Get('get_useractivity_for_notification')
  async getUserAcForNotify() {
    return this.activitiesService.getUserAcForNotify()
  }

  @Post('notify_user')
  async notifyUser(@Body() notifyDto: NotifyDto) {
    return this.activitiesService.notifyUser(notifyDto)
  }

  @Get('wait_to_start')
  async waitToStartActivity() {
    return this.activitiesService.waitToStartActivity()
  }

  @Get('ongoing_activity')
  async ongoingActivity() {
    return this.activitiesService.ongoingActivity()
  }

  @Get('ended_activity')
  async endedActivity() {
    return this.activitiesService.endedActivity()
  }

  @Get('get_user_for_competition')
  async getAllUsersForUser() {
    return this.activitiesService.getAllUsersForUser()
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
    let fileUp = await this.fileUpload.findByPk(3)
    const fileBuffer = readFileSync(join(process.cwd(),fileUp.file_path));
    const pdfDoc = await PDFDocument.load(fileBuffer)
    const pages = pdfDoc.getPages()
    const firstPage = pages[0]
    const text = 'Hello, world!';
    const textWidth = 24
    const textHeight = 24;
    const x = 50;
    const y = 50;

    firstPage.drawText(text, {
      x: 1,
      y: 1,
      size: 24,
    });
    const modifiedPdfBytes = await pdfDoc.save();
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${fileUp.file_name}"`,
    });

    res.send(modifiedPdfBytes)
  }

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
  //     fileStream.pipe(res);
  //     res.set({
  //       // 'Content-Type': 'application/json',
  //       'Content-Disposition': `attachment; filename="${fileUp.file_name}"`,
  //     });
  // }
}
