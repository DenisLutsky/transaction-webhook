import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { SALT_ROUND } from 'shared/constants';

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SALT_ROUND);
};

export const comparePasswords = async (password: string, hash: string): Promise<void> => {
  const match = await bcrypt.compare(password, hash);

  if (!match) throw new BadRequestException(`Passwords don't match`);
};
