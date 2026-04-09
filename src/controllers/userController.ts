import type {Request, Response} from 'express';
import fs from 'node:fs/promises';
import {userService} from '../services/userService';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export async function getAllUsers(_: Request, res: Response) {
  res.status(200).json(await userService.findAll());
}

export async function getUserById(req: Request<{ id: string }>, res: Response) {
  const user = await userService.findById(req.params.id);
  if (!user) return res.status(404).json({error: 'User not found'});
  res.status(200).json(user);
}

export async function getMe(req: Request, res: Response) {
  const user = await userService.findById(req.user!.id);
  if (!user) return res.status(404).json({error: 'User not found'});
  res.status(200).json(user);
}

export async function uploadAvatar(req: Request, res: Response) {
  if (!req.file) {
    return res.status(400).json({error: 'No file provided'});
  }

  const {path: tmpPath, mimetype, size} = req.file;
  if (!ALLOWED_MIME_TYPES.includes(mimetype)) {
    await fs.unlink(tmpPath);
    return res.status(400).json({error: 'Invalid file type. Only JPEG and PNG are allowed'});
  }
  if (size > MAX_SIZE_BYTES) {
    await fs.unlink(tmpPath);
    return res.status(400).json({error: 'File is too large. Maximum size is 5 MB'});
  }
  try {
    const avatarUrl = await userService.uploadAvatar(req.user!.id, tmpPath, mimetype);
    res.status(200).json({message: 'Аватарку успішно оновлено.', avatarUrl});
  } catch (err: any) {
    res.status(err.status ?? 500).json({error: err.message ?? 'Internal server error'});
  } finally {
    await fs.unlink(tmpPath).catch(() => {});
  }
}

export async function deleteAvatar(req: Request, res: Response) {
  try {
    await userService.deleteAvatar(req.user!.id);
    res.status(200).json({message: 'Аватарку видалено.'});
  } catch (err: any) {
    res.status(err.status ?? 500).json({error: err.message ?? 'Internal server error'});
  }
}