import { Test, TestingModule } from '@nestjs/testing';
import { UserActivitiesConfirmedService } from './user-activities-confirmed.service';

describe('UserActivitiesConfirmedService', () => {
  let service: UserActivitiesConfirmedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserActivitiesConfirmedService],
    }).compile();

    service = module.get<UserActivitiesConfirmedService>(UserActivitiesConfirmedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
