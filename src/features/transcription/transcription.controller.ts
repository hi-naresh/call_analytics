import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TranscriptionService } from './services/transcription.service';
import { TranscriptionResponseDto } from './dto/transcription-response.dto';

@Controller('transcription')
export class TranscriptionController {
  constructor(private readonly transcriptionService: TranscriptionService) {}

  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  async transcribeFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<TranscriptionResponseDto> {
    return this.transcriptionService.transcribe(file.path);
  }

  @Post('url')
  async transcribeUrl(
    @Body('url') url: string,
  ): Promise<TranscriptionResponseDto> {
    return this.transcriptionService.transcribeFromUrl(url);
  }
}
