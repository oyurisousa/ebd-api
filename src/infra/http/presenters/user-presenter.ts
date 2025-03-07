import { User } from '@/domain/ebd/enterprise/user';

export class UserPresenter {
  static toHTTP(user: User) {
    return {
      id: user.id.toString(),
      email: user.email,
      role: user.role.toString(),
      username: user.username.value,
      isMember: user.isMember(),
      memberId: user.isMember() ? user.memberId?.toString() : null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
