import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AudioDownloader {
  private readonly logger = new Logger(AudioDownloader.name);

  constructor(private readonly httpService: HttpService) {}

  async downloadAudio(audioUrl: string, tempFilePath: string): Promise<void> {
    const { createWriteStream } = await import('fs');
    const { promisify } = await import('util');
    const { pipeline } = await import('stream');
    const pipelineAsync = promisify(pipeline);

    this.logger.debug(`Downloading audio from URL: ${audioUrl}`);
    const response = await firstValueFrom(
      this.httpService.get(audioUrl, { responseType: 'stream' }),
    );
    const fileStream = createWriteStream(tempFilePath);
    await pipelineAsync(response.data, fileStream);
  }
}
