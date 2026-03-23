import type {Request, Response} from 'express';
import {userService} from '../services/userService';
import type {UserDto} from '../schemas/userSchema';

export function getUserById(req: Request<{ id: string; }>, res: Response) {
  const user = userService.findById(req.params.id);
  if (!user) {
    return res.status(404).json({error: 'User not found'});
  }
  res.status(200).json(user);
}

export function getAllUsers(_: Request, res: Response) {
  res.status(200).json(userService.findAll());
}

export function createUser(req: Request<{}, {}, UserDto>, res: Response) {
  if (userService.existsEmail(req.body.email)) {
    return res.status(400).json({error: 'User with this email already exists'});
  }
  res.status(201).json(userService.create(req.body));
}