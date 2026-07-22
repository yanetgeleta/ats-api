import { Test, TestingModule } from '@nestjs/testing';
import { ApplicantsController } from './applicants.controller';
import { ApplicantsService } from './applicants.service';

describe('ApplicantsController', () => {
  let controller: ApplicantsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApplicantsController],
      providers: [ApplicantsService],
    }).compile();

    controller = module.get<ApplicantsController>(ApplicantsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
