import { IsUrl } from 'class-validator';

export class TranscriptionUrlDto {
  @IsUrl()
  audioUrl: string;
}
