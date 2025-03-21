import { Test, TestingModule } from '@nestjs/testing';
import { ReservationService } from './reservation.service';
import { ReservationRepository } from '../../db/repositories/reservation.repository';
import { RoomService } from '../room/room.service';
import { mockCreateReservationInput, mockReservation, mockReservationDTO, mockRoom } from '../../../test/mock';
import { HttpException } from '@nestjs/common';

describe('ReservationService', () => {
  let service: ReservationService;
  let spyRoomService: RoomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationService,
        {
          provide: ReservationRepository,
          useFactory: () => ({
            getReservations: jest.fn(),
            getReservation: jest.fn(),
            createReservation: jest.fn(() => mockReservation),
            cancelReservation: jest.fn(),
          })
        },
        {
          provide: RoomService,
          useFactory: () => ({
            getAvailableRoomTypes: jest.fn(),
            getRooms: jest.fn(),
            getRoomById: jest.fn(),
            createRoom: jest.fn(),
            updateRoom: jest.fn(),
            deleteRoom: jest.fn(),
            getAvailableRoom: jest.fn(() => mockRoom),
          })
        }

      ],
    }).compile();

    service = module.get<ReservationService>(ReservationService);
    spyRoomService = module.get<RoomService>(RoomService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createReservation', () => {
    it('successful', async () => {
      const result = await service.createReservation(
        mockCreateReservationInput
      )
      expect(result).toEqual(mockReservationDTO)
    })

    it('invalid reservation Period', async () => {
      try {
        mockCreateReservationInput.endDate = new Date('2025-04-15T00:00:00.000Z');
        await service.createReservation(
          mockCreateReservationInput
        )
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException)
      } 
    })

    it('invalid number of guests', async () => {
      try {
        mockCreateReservationInput.endDate = new Date('2025-04-18T00:00:00.000Z');
        mockCreateReservationInput.numberOfGuests = 7;
        await service.createReservation(
          mockCreateReservationInput
        )
      } catch (error) {
        expect(error.message).toEqual('the number of guests is not valid for room type')
      } 
    })

    it('no room available', async () => {
      try {
        mockCreateReservationInput.numberOfGuests = 1;
        jest
          .spyOn(spyRoomService, 'getAvailableRoom')
          .mockResolvedValue(null)
        await service.createReservation(
          mockCreateReservationInput
        )
      } catch (error) {
        expect(error.message).toEqual(
          'No rooms are available that satisfy all reservation requirements. Please modify your criteria or select alternative dates'
        )
      } 
    })

    it('no room available', async () => {
      try {
        mockCreateReservationInput.numberOfGuests = 1;
        jest
          .spyOn(spyRoomService, 'getAvailableRoom')
          .mockImplementation(() => Promise.reject(new Error('error')))
        await service.createReservation(
          mockCreateReservationInput
        )
      } catch (error) {
        expect(error.message).toEqual(
          'An error occurred while creating the reservation'
        )
      } 
    })
  })
});
