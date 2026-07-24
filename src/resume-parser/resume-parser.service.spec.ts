import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { ResumeParserService } from './resume-parser.service';

// Mock the Groq SDK, no real api is called
jest.mock('groq-sdk', () => {
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn(),
      },
    },
  }));
});

describe('ResumeParserService', () => {
  let service: ResumeParserService;
  let mockGroqCreate: jest.Mock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResumeParserService],
    }).compile();

    service = module.get<ResumeParserService>(ResumeParserService);

    mockGroqCreate = (service as any).groq.chat.completions.create;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('extractStructuredData', () => {
    it('returns clean parsed data when Groq responds with a valid shape', async () => {
      mockGroqCreate.mockResolvedValue({
        choices: [
          {
            message: {
              content: JSON.stringify({
                name: 'Yanet Geleta Gudisa',
                email: 'yanetgele@gmail.com',
                phone: '+251941493222',
              }),
            },
          },
        ],
      });

      const result = await (service as any).extractStructuredData(
        'some resume text',
      );

      expect(result).toEqual({
        name: 'Yanet Geleta Gudisa',
        email: 'yanetgele@gmail.com',
        phone: '+251941493222',
      });
    });

    it('throws BadRequestException when Groq returns data missing required fields', async () => {
      mockGroqCreate.mockResolvedValue({
        choices: [
          {
            message: {
              content: JSON.stringify({
                name: 'Yanet Geleta Gudisa',
                phone: null,
              }),
            },
          },
        ],
      });

      await expect(
        (service as any).extractStructuredData('some resume text'),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
