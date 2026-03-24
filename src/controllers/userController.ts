import type {Request, Response} from 'express';
import {userService} from '../services/userService';

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