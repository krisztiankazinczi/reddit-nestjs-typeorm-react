import { IsIn, IsNotEmpty } from 'class-validator';

export class VoteBodyDto {
  @IsNotEmpty()
  identifier: string;

  @IsNotEmpty()
  slug: string;

  commentIdentifier?: string;

  @IsIn([-1, 0, 1], { message: 'value must be -1, 0, 1' })
  value: number;
}
