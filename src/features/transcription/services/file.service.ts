import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);

  async verifyFileExists(filePath: string): Promise<void> {
    const fs = await import('fs');
    if (!fs.existsSync(filePath)) {
      this.logger.error(`File not found at: ${filePath}`);
      throw new InternalServerErrorException(
        `Audio file not found at: ${filePath}`,
      );
    }
  }

  async createTempDirectory(dirPath: string): Promise<void> {
    const fs = await import('fs');
    await fs.promises.mkdir(dirPath, { recursive: true });
  }

  async deleteFile(filePath: string): Promise<void> {
    const fs = await import('fs');
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }
  }
}
