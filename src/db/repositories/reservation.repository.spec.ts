import { Test, TestingModule } from '@nestjs/testing';
import { ReservationRepository } from './reservation.repository';

describe('ReservationRepositoryService', () => {
  let service: ReservationRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReservationRepository],
    }).compile();

    service = module.get<ReservationRepository>(ReservationRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
