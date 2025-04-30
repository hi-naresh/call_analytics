import { TranscriptionResponseDto } from '../dto/transcription-response.dto';

export interface TranscriptionProvider {
  transcribe(audioPath: string): Promise<TranscriptionResponseDto>;
}
