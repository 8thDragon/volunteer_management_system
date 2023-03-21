import { ApiProperty } from "@nestjs/swagger";

export class UploadFileDto {

    @ApiProperty({ type: 'string', format: 'binary', required: true })
    fileName: string;

    @ApiProperty()
    user_id?: number;

    @ApiProperty()
    file_field?: string;

}