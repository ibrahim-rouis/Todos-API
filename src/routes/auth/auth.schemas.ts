import { z } from 'zod';

const idSchema = z.number();
const usernameSchema = z
  .string({ message: 'Username is required' })
  .min(3)
  .max(32);
const emailSchema = z
  .string({ message: 'Email is required' })
  .email({ message: 'Invalid email address' });
const passwordSchema = z
  .string({ message: 'Password is required' })
  .min(6)
  .max(56);
const passwordHashSchema = z.string();

const UserSchema = z.object({
  id: idSchema,
  username: usernameSchema,
  email: emailSchema,
  password_hash: passwordHashSchema,
});

const CreateUserSchema = z.object({}).merge(UserSchema).omit({ id: true });

export const RegisterUserSchema = z
  .object({
    password: passwordSchema,
  })
  .merge(UserSchema)
  .omit({ id: true, password_hash: true });

export const LoginUserSchema = z
  .object({
    password: passwordSchema,
  })
  .merge(UserSchema)
  .omit({ id: true, password_hash: true, username: true });

export type User = z.infer<typeof UserSchema>;
export type RegisterUserData = z.infer<typeof RegisterUserSchema>;
export type LoginUserData = z.infer<typeof LoginUserSchema>;
export type CreateUserData = z.infer<typeof CreateUserSchema>;
