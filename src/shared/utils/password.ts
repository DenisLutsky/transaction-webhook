import * as bcrypt from 'bcrypt';
import { SALT_ROUND } from 'shared/constants';

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SALT_ROUND);
};
