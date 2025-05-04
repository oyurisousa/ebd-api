import { Either, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { Meta } from '@/core/repositories/meta';
import { RegistrationsRepository } from '../../repositories/registrations-repository';
import { RegistrationWithName } from '@/domain/ebd/enterprise/value-objects/registration-with-name';

interface FetchRegistrationsUseCaseRequest {
  page: number;
  trimesterRoomId: string;
  perPage?: number;
  name?: string;
}

type FetchRegistrationsUseCaseResponse = Either<
  null,
  {
    registrations: RegistrationWithName[];
    meta: Meta;
  }
>;

@Injectable()
export class FetchRegistrationsUseCase {
  constructor(private registrationsRepository: RegistrationsRepository) {}

  async execute({
    page,
    perPage,
    name,
    trimesterRoomId,
  }: FetchRegistrationsUseCaseRequest): Promise<FetchRegistrationsUseCaseResponse> {
    const { registrations, meta } = await this.registrationsRepository.findMany(
      { page, perPage },
      { trimesterRoomId, name },
    );

    return right({
      registrations,
      meta,
    });
  }
}
