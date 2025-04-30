import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { TranscriptionResponseDto } from '../dto/transcription-response.dto';
import { TranscriptionProvider } from '../interfaces/transcription-provider.interface';
import { FileService } from './file.service';
import { AudioDownloader } from './audio-downloader.service';

@Injectable()
export class TranscriptionService {
  private readonly logger = new Logger(TranscriptionService.name);

  constructor(
    @Inject('TranscriptionProvider')
    private readonly provider: TranscriptionProvider,
    private readonly fileService: FileService,
    private readonly audioDownloader: AudioDownloader,
  ) {
    this.logger.debug('TranscriptionService initialized');
  }

  async transcribe(audioPath: string): Promise<TranscriptionResponseDto> {
    return this.provider.transcribe(audioPath);
  }

  async transcribeFromUrl(audioUrl: string): Promise<TranscriptionResponseDto> {
    const path = await import('path');
    const tempFilePath = path.join(
      __dirname,
      '..',
      '..',
      'temp',
      `audio-${Date.now()}.mp3`,
    );

    try {
      await this.fileService.createTempDirectory(path.dirname(tempFilePath));
      await this.audioDownloader.downloadAudio(audioUrl, tempFilePath);
      const result = await this.transcribe(tempFilePath);
      await this.fileService.deleteFile(tempFilePath);
      return result;
    } catch (error) {
      await this.fileService.deleteFile(tempFilePath);
      const axiosError = error as { message: string; stack?: string };
      this.logger.error(
        `URL transcription failed: ${axiosError.message}`,
        axiosError.stack,
      );
      throw new InternalServerErrorException(
        `Failed to process audio from URL: ${axiosError.message}`,
      );
    }
  }
}
