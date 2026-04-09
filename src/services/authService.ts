import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import prisma from '../db/prisma';
import type {RegisterDTO, LoginDTO, RequestPasswordResetDTO, ResetPasswordDTO} from '../schemas/authSchema';
import {sendPasswordResetEmail} from '../utils/sendMail';

const SALT_ROUNDS = 12;

function generateAccessToken(payload: { id: string; email: string; role: string }): string {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN ?? '15m',
  } as jwt.SignOptions);
}

async function createRefreshToken(userId: string): Promise<string> {
  const token = crypto.randomBytes(64).toString('hex');
  const days = parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN_DAYS ?? '7', 10);
  const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

  await prisma.refreshToken.create({data: {token, userId, expiresAt}});

  return token;
}

function omitHash<T extends { passwordHash: string }>(user: T): Omit<T, 'passwordHash'> {
  const {passwordHash: _, ...safe} = user;
  return safe;
}

class AuthService {
  async register(dto: RegisterDTO) {
    const existing = await prisma.user.findUnique({where: {email: dto.email}});
    if (existing) {
      throw {status: 400, message: 'User with this email already exists'};
    }

    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
    const user = await prisma.user.create({
      data: {name: dto.name, email: dto.email, passwordHash},
    });

    const accessToken = generateAccessToken({id: user.id, email: user.email, role: user.role});
    const refreshToken = await createRefreshToken(user.id);

    return {token: accessToken, refreshToken, user: omitHash(user)};
  }

  async login(dto: LoginDTO) {
    const user = await prisma.user.findUnique({where: {email: dto.email}});
    if (!user) {
      throw {status: 401, message: 'Invalid email or password'};
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) {
      throw {status: 401, message: 'Invalid email or password'};
    }

    const accessToken = generateAccessToken({id: user.id, email: user.email, role: user.role});
    const refreshToken = await createRefreshToken(user.id);

    return {token: accessToken, refreshToken, user: omitHash(user)};
  }

  async refresh(token: string) {
    const stored = await prisma.refreshToken.findUnique({
      where: {token},
      include: {user: true},
    });

    if (!stored || stored.expiresAt < new Date()) {
      if (stored) {
        await prisma.refreshToken.delete({where: {token}});
      }
      throw {status: 401, message: 'Invalid or expired refresh token'};
    }

    await prisma.refreshToken.delete({where: {token}});

    const {user} = stored;
    const accessToken = generateAccessToken({id: user.id, email: user.email, role: user.role});
    const newRefreshToken = await createRefreshToken(user.id);

    return {token: accessToken, refreshToken: newRefreshToken};
  }

  async logout(token: string) {
    await prisma.refreshToken.deleteMany({where: {token}});
  }

  // stateless
  async requestPasswordReset(dto: RequestPasswordResetDTO) {
    const user = await prisma.user.findUnique({where: {email: dto.email}});
    if (!user) {
      return;
    }
    const resetToken = jwt.sign(
      {email: user.email},
      process.env.PASSWORD_RESET_SECRET!,
      {expiresIn: process.env.PASSWORD_RESET_EXPIRES_IN ?? '10m'} as jwt.SignOptions,
    );
    await sendPasswordResetEmail(user.email, resetToken);
  }

  async resetPassword(dto: ResetPasswordDTO) {
    let email: string;
    try {
      const payload = jwt.verify(dto.token, process.env.PASSWORD_RESET_SECRET!) as { email: string };
      email = payload.email;
    } catch {
      throw {status: 400, message: 'Invalid or expired reset token'};
    }
    const user = await prisma.user.findUnique({where: {email}});
    if (!user) {
      throw {status: 400, message: 'Invalid or expired reset token'};
    }
    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
    await prisma.user.update({where: {id: user.id}, data: {passwordHash}});
  }
}

export const authService = new AuthService();