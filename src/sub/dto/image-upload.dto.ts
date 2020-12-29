import { IsIn } from 'class-validator';

export class ImageUploadDto {
  @IsIn(['image', 'banner'], {
    message: 'fileType can be image or banner only',
  })
  type: string;
}
