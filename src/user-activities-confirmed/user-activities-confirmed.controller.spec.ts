import { Test, TestingModule } from '@nestjs/testing';
import { UserActivitiesConfirmedController } from './user-activities-confirmed.controller';
import { UserActivitiesConfirmedService } from './user-activities-confirmed.service';

describe('UserActivitiesConfirmedController', () => {
  let controller: UserActivitiesConfirmedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserActivitiesConfirmedController],
      providers: [UserActivitiesConfirmedService],
    }).compile();

    controller = module.get<UserActivitiesConfirmedController>(UserActivitiesConfirmedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
