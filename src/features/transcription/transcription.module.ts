import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { FileService } from './services/file.service';
import { AudioDownloader } from './services/audio-downloader.service';
import { TranscriptionController } from './transcription.controller';
import { TranscriptionService } from './services/transcription.service';
import { ElevenLabsProvider } from './services/eleven-labs.provider';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [
    FileService,
    AudioDownloader,
    TranscriptionService,
    {
      provide: 'TranscriptionProvider',
      useClass: ElevenLabsProvider,
    },
  ],
  controllers: [TranscriptionController],
  exports: [TranscriptionService],
})
export class TranscriptionModule {}
