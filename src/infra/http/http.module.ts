import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { RegisterUserUseCase } from '@/domain/ebd/application/use-cases/user/register-user';
import { CreateAccountUserController } from './controllers/user/register-user.controller';
import { CreateMemberController } from './controllers/member/create-member.controller';
import { CreateMemberUseCase } from '@/domain/ebd/application/use-cases/member/create-member';
import { AuthenticateUserController } from './controllers/auth/authenticate-user.controller';
import { AuthenticateUserUseCase } from '@/domain/ebd/application/use-cases/auth/authenticate-user';
import { FetchMembersController } from './controllers/member/fetch-members.controller';
import { FetchMembersUseCase } from '@/domain/ebd/application/use-cases/member/fetch-members';
import { GetUserDetailsController } from './controllers/user/get-user-details.controller';
import { GetUserDetailsUseCase } from '@/domain/ebd/application/use-cases/user/get-user-details';
import { CreateTrimesterController } from './controllers/trimester/create-trimester.controller';
import { CreateTrimesterUseCase } from '@/domain/ebd/application/use-cases/trimester/create-trimester';
import { CreateRoomController } from './controllers/room/create-room.controller';
import { CreateRoomUseCase } from '@/domain/ebd/application/use-cases/room/create-room';
import { CreateTrimesterRoomController } from './controllers/trimester-room/create-trimester-room.controller';
import { CreateTrimesterRoomUseCase } from '@/domain/ebd/application/use-cases/trimester-room/create-trimester-room';
import { AllocateTeacherController } from './controllers/trimester-room/allocate-teacher.controller';
import { AllocateTeacherUseCase } from '@/domain/ebd/application/use-cases/trimester-room/allocate-teacher';
import { MeController } from './controllers/auth/me.controller';
import { EnrollStudentController } from './controllers/trimester-room/enroll-student.controller';
import { EnrollStudentUseCase } from '@/domain/ebd/application/use-cases/trimester-room/enroll-student';
import { FetchRoomsController } from './controllers/room/fetch-rooms.controller';
import { FetchRoomsUseCase } from '@/domain/ebd/application/use-cases/room/fetch-rooms';
import { FetchTrimestersController } from './controllers/trimester/fetch-trimesters.controller';
import { FetchTrimestersUseCase } from '@/domain/ebd/application/use-cases/trimester/fetch-trimesters';
import { FetchTrimesterRoomsController } from './controllers/trimester-room/fetch-trimesters-rooms.controller';
import { FetchTrimesterRoomsUseCase } from '@/domain/ebd/application/use-cases/trimester-room/fetch-trimester-room';
import { CreatePreLessonController } from './controllers/lesson/create-pre-lesson.controller';
import { CreatePreLessonUseCase } from '@/domain/ebd/application/use-cases/pre-lesson/create-pre-lesson';
import { FetchRegistrationsController } from './controllers/registration/fetch-registrations.controller';
import { FetchRegistrationsUseCase } from '@/domain/ebd/application/use-cases/registration/fetch-registrations';
import { FetchUsersController } from './controllers/user/fetch-users.controller';
import { FetchUsersUseCase } from '@/domain/ebd/application/use-cases/user/fetch-users';
import { FetchPreLessonsController } from './controllers/lesson/fetch-pre-lessons.controller';
import { FetchPreLessonsUseCase } from '@/domain/ebd/application/use-cases/pre-lesson/fetch-pre-lessons';
import { CreateLessonController } from './controllers/lesson/create-lesson.controller';
import { CreateLessonUseCase } from '@/domain/ebd/application/use-cases/lesson/create-lesson';
import { GetMemberDetailsController } from './controllers/member/get-member-details.controller';
import { GetMemberDetailsUseCase } from '@/domain/ebd/application/use-cases/member/get-member-details';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    AuthenticateUserController,
    AllocateTeacherController,
    CreateAccountUserController,
    CreateMemberController,
    CreateTrimesterController,
    CreateRoomController,
    CreateTrimesterRoomController,
    CreatePreLessonController,
    CreateLessonController,
    GetUserDetailsController,
    GetMemberDetailsController,
    FetchMembersController,
    FetchRoomsController,
    FetchTrimestersController,
    FetchTrimesterRoomsController,
    FetchRegistrationsController,
    FetchUsersController,
    FetchPreLessonsController,
    MeController,
    EnrollStudentController,
  ],
  providers: [
    AuthenticateUserUseCase,
    AllocateTeacherUseCase,
    RegisterUserUseCase,
    CreateMemberUseCase,
    CreateTrimesterUseCase,
    CreateRoomUseCase,
    CreateTrimesterRoomUseCase,
    CreatePreLessonUseCase,
    CreateLessonUseCase,
    GetUserDetailsUseCase,
    GetMemberDetailsUseCase,
    FetchMembersUseCase,
    FetchRoomsUseCase,
    FetchTrimestersUseCase,
    FetchTrimesterRoomsUseCase,
    FetchRegistrationsUseCase,
    FetchUsersUseCase,
    FetchPreLessonsUseCase,
    EnrollStudentUseCase,
  ],
})
export class HttpModule {}
