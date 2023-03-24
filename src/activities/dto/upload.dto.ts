import { ApiProperty } from "@nestjs/swagger";

export class UploadFileDto {

    @ApiProperty({ type: 'string', format: 'binary', required: true })
    file_name?: string;

    @ApiProperty()
    file_path?: string;

    @ApiProperty()
    activityId?: number;
}