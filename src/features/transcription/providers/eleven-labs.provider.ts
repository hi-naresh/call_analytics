import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { TranscriptionResponseDto } from '../dto/transcription-response.dto';
import { FileService } from './file.service';
import { TranscriptionProvider } from '../interfaces/transcription-provider.interface';
import * as FormData from 'form-data';

@Injectable()
export class ElevenLabsProvider implements TranscriptionProvider {
  private readonly logger = new Logger(ElevenLabsProvider.name);
  private readonly apiKey: string;
  private readonly apiUrl: string =
    'https://api.elevenlabs.io/v1/speech-to-text';

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly fileService: FileService,
  ) {
    const apiKey = this.configService.get<string>('ELEVEN_LABS_API_KEY');
    if (!apiKey) {
      throw new InternalServerErrorException(
        'ELEVEN_LABS_API_KEY is not configured in environment variables',
      );
    }
    this.apiKey = apiKey;
  }

  async transcribe(audioPath: string): Promise<TranscriptionResponseDto> {
    try {
      this.logger.debug(`Transcribing audio from path: ${audioPath}`);
      await this.fileService.verifyFileExists(audioPath);

      const path = await import('path');
      const fs = await import('fs');

      const formData = new FormData();
      formData.append('file', fs.createReadStream(audioPath), {
        filename: path.basename(audioPath),
        contentType: 'audio/wav',
      });
      formData.append('model_id', 'scribe_v1');
      formData.append('language_code', 'en');

      this.logger.debug('Sending request to Eleven Labs STT API');
      const response = await firstValueFrom(
        this.httpService.post<{ text: string }>(this.apiUrl, formData, {
          headers: {
            'xi-api-key': this.apiKey,
            'Content-Type': `multipart/form-data; boundary=${formData.getBoundary()}`,
          },
        }),
      );

      this.logger.debug('Received response from Eleven Labs STT API');
      return { transcript: response.data.text };
    } catch (error) {
      const axiosError = error as {
        response?: { status?: number; data?: unknown };
        message: string;
        stack?: string;
      };
      this.logger.error(
        `Transcription failed: ${axiosError.message}`,
        axiosError.stack,
      );
      if (axiosError.response) {
        this.logger.error(`HTTP Status: ${axiosError.response.status}`);
        this.logger.error(
          `Response data: ${JSON.stringify(axiosError.response.data, null, 2)}`,
        );
      }
      throw new InternalServerErrorException(
        `Failed to transcribe audio: ${axiosError.message}`,
      );
    }
  }
}
