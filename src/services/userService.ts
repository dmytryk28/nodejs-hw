import {v2 as cloudinary} from 'cloudinary';
import prisma from '../db/prisma';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

function omitPasswordHash<T extends { passwordHash: string }>(
  user: T
): Omit<T, 'passwordHash'> {
  const {passwordHash: _, ...safe} = user;
  return safe;
}

function extractPublicId(avatarUrl: string): string {
  const parts = avatarUrl.split('/');
  const filename = parts[parts.length - 1];
  const folder = parts[parts.length - 2];
  return `${folder}/${filename.replace(/\.[^/.]+$/, '')}`;
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

  async uploadAvatar(userId: string, tmpPath: string, mimetype: string): Promise<string> {
    const user = await prisma.user.findUnique({where: {id: userId}});
    if (!user) throw {status: 404, message: 'User not found'};
    if (user.avatarUrl) {
      try {
        await cloudinary.uploader.destroy(extractPublicId(user.avatarUrl));
      } catch {
        // ignore
      }
    }

    const uploadResult = await cloudinary.uploader.upload(tmpPath, {
      folder: 'avatars',
      public_id: userId,
      overwrite: true,
      resource_type: 'image',
      format: mimetype === 'image/png' ? 'png' : 'jpg',
    });
    const avatarUrl = uploadResult.secure_url;
    await prisma.user.update({where: {id: userId}, data: {avatarUrl}});
    return avatarUrl;
  }

  async deleteAvatar(userId: string): Promise<void> {
    const user = await prisma.user.findUnique({where: {id: userId}});
    if (!user) throw {status: 404, message: 'User not found'};
    if (!user.avatarUrl) throw {status: 404, message: 'No avatar to delete'};
    try {
      await cloudinary.uploader.destroy(extractPublicId(user.avatarUrl));
    } catch {
      // ignore
    }
    await prisma.user.update({where: {id: userId}, data: {avatarUrl: null}});
  }
}

export const userService = new UserService();