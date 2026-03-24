import prisma from '../db/prisma';

function omitPasswordHash<T extends { passwordHash: string }>(
  user: T
): Omit<T, 'passwordHash'> {
  const {passwordHash: _, ...safe} = user;
  return safe;
}

class UserService {
  async findAll() {
    const users = await prisma.user.findMany();
    return users.map(omitPasswordHash);
  }

  async findById(id: string) {
    const user = await prisma.user.findUnique({where: {id}});
    if (!user) return null;
    return omitPasswordHash(user);
  }
}

export const userService = new UserService();