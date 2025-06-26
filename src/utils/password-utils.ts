import * as bcrypt from 'bcrypt';

const saltRounds: number = 10;

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(
  password: string,
  password_hash: string,
): Promise<boolean> {
  return await bcrypt.compare(password, password_hash);
}
