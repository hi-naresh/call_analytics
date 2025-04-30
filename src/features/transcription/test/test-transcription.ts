import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import { config } from 'dotenv';
import * as FormData from 'form-data';

// Load environment variables
config();

async function testTranscription() {
  const audioPath = path.join(__dirname, 'static', 'audio.wav');
  const apiKey = process.env.ELEVEN_LABS_API_KEY;
  const apiUrl = 'https://api.elevenlabs.io/v1/speech-to-text';

  // Validate inputs
  if (!apiKey) {
    console.error('Error: ELEVEN_LABS_API_KEY is not set in .env');
    return;
  }
  if (!fs.existsSync(audioPath)) {
    console.error(`Error: Audio file not found at ${audioPath}`);
    return;
  }

  // Verify FormData
  console.log('FormData constructor:', FormData);
  if (!(FormData instanceof Function)) {
    console.error('Error: FormData is not a constructor');
    return;
  }

  try {
    // Use Node.js native FormData
    const formData = new FormData();
    formData.append('file', fs.createReadStream(audioPath), {
      filename: path.basename(audioPath),
      contentType: 'audio/wav',
    });
    formData.append('model_id', 'scribe_v1'); // Use STT model ID
    formData.append('language_code', 'en'); // Optional: ISO-639-1 code for English

    console.log('Sending request to Eleven Labs STT API...');
    const response = await axios.post(apiUrl, formData, {
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': `multipart/form-data; boundary=${formData.getBoundary()}`,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
    const transcript = response.data.text;
    console.log('Transcript:', transcript);
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    console.error('Error during transcription:', error.message);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (error.response) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      console.error('HTTP Status:', error.response.status);
      console.error(
        'Response data:',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        JSON.stringify(error.response.data, null, 2),
      );
    } else {
      console.error('Error details:', error);
    }
  }
}

testTranscription().then(() => console.log('Transcription test completed'));
