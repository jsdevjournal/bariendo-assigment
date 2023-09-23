import { Test, TestingModule } from '@nestjs/testing';
import { DoctoravailabilityService } from './doctoravailability.service';

describe('DoctoravailabilityService', () => {
  let service: DoctoravailabilityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DoctoravailabilityService],
    }).compile();

    service = module.get<DoctoravailabilityService>(DoctoravailabilityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
