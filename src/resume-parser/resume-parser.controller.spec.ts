import { Test, TestingModule } from '@nestjs/testing';
import { ResumeParserController } from './resume-parser.controller';

describe('ResumeParserController', () => {
  let controller: ResumeParserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResumeParserController],
    }).compile();

    controller = module.get<ResumeParserController>(ResumeParserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
