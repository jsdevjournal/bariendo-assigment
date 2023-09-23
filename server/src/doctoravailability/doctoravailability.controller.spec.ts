import { Test, TestingModule } from '@nestjs/testing';
import { DoctoravailabilityController } from './doctoravailability.controller';
import { DoctoravailabilityService } from './doctoravailability.service';

describe('DoctoravailabilityController', () => {
  let controller: DoctoravailabilityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DoctoravailabilityController],
      providers: [DoctoravailabilityService],
    }).compile();

    controller = module.get<DoctoravailabilityController>(
      DoctoravailabilityController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
