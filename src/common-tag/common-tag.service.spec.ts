import { Test, TestingModule } from '@nestjs/testing';
import { CommonTagService } from './common-tag.service';

describe('CommonTagService', () => {
  let service: CommonTagService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommonTagService],
    }).compile();

    service = module.get<CommonTagService>(CommonTagService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
