import { Test, TestingModule } from '@nestjs/testing';
import { TranscriptionService } from './transcription.service';
import { FileService } from './file.service';
import { AudioDownloader } from './audio-downloader.service';
import { TranscriptionProvider } from '../interfaces/transcription-provider.interface';

describe('TranscriptionService', () => {
  let service: TranscriptionService;
  let mockProvider: TranscriptionProvider;

  beforeEach(async () => {
    mockProvider = {
      transcribe: jest
        .fn()
        .mockResolvedValue({ transcript: 'test transcript' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TranscriptionService,
        FileService,
        AudioDownloader,
        {
          provide: 'TranscriptionProvider',
          useValue: mockProvider,
        },
      ],
    }).compile();

    service = module.get<TranscriptionService>(TranscriptionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should transcribe audio', async () => {
    const result = await service.transcribe('test.wav');
    expect(result).toEqual({ transcript: 'test transcript' });
    // expect(mockProvider.transcribe).toHaveBeenCalledWith('test.wav');
  });
});
