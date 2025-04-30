import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TranscriptionModule } from './features/transcription/transcription.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI as string, {
      connectionName: 'mainConnection',
    }), //change to MongoDB connection string and in database later
    TranscriptionModule,
    // VoiceAgentModule,
    // AnalyticsModule,
    // DashboardModule,
  ],
})
export class AppModule {}
