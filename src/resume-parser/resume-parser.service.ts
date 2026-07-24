// src/resume-parser/resume-parser.service.ts
import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import Groq from 'groq-sdk';
import {
  ParsedResumeSchema,
  ParsedResumeData,
} from './schemas/parsed-resume.schema';
import { PDFParse } from 'pdf-parse';
import 'dotenv/config';

@Injectable()
export class ResumeParserService {
  private readonly groq: Groq;

  constructor() {
    this.groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }

  async parseResume(fileBuffer: Buffer): Promise<ParsedResumeData> {
    const text = await this.extractText(fileBuffer);

    if (!text || text.trim().length < 20) {
      throw new BadRequestException(
        'Could not extract readable text from this file.',
      );
    }

    return this.extractStructuredData(text);
  }

  private async extractText(fileBuffer: Buffer): Promise<string> {
    try {
      //     const parser = new PDFParse({ data: buffer });
      // const data = await parser.getText();
      // return data.text;
      const result = new PDFParse({ data: fileBuffer });
      const data = await result.getText();
      return data.text;
    } catch {
      throw new BadRequestException(
        'Unable to read this PDF. Ensure it is not corrupted or a scanned image.',
      );
    }
  }

  private async extractStructuredData(
    resumeText: string,
  ): Promise<ParsedResumeData> {
    const systemPrompt = `You extract structured contact information from resumes.
Return ONLY a JSON object with this exact shape, nothing else:
{ "name": string, "email": string, "phone": string or null }
If a field truly cannot be found, use null for phone. Do your best to infer name and email — they are required.`;

    let completion;
    try {
      completion = await this.groq.chat.completions.create({
        model: 'openai/gpt-oss-120b',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: resumeText.slice(0, 8000) },
        ],
        response_format: { type: 'json_object' },
        temperature: 0,
      });
    } catch {
      throw new InternalServerErrorException(
        'Resume parsing service is unavailable right now.',
      );
    }

    const raw = completion.choices[0]?.message?.content;
    if (!raw) {
      throw new InternalServerErrorException(
        'No response from resume parsing service.',
      );
    }

    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(raw);
    } catch {
      throw new InternalServerErrorException(
        'Resume parsing service returned an invalid response.',
      );
    }

    const result = ParsedResumeSchema.safeParse(parsedJson);
    if (!result.success) {
      throw new BadRequestException(
        'Could not confidently extract required applicant details (name/email) from this resume.',
      );
    }

    return result.data;
  }
}
