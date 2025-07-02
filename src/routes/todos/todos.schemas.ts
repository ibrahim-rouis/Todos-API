import z from 'zod';

const id = z.number();
const title = z.string().nonempty();
const description = z.string().nonempty().nullable();
const completed = z.boolean();
const created_at = z.date();
const updated_at = z.date();
const user_id = z.number();

export const TodoSchema = z.object({
  id,
  title,
  description,
  completed,
  created_at,
  updated_at,
  user_id,
});

export const TodoCreateBodySchema = z.object({
  title,
  description,
});

export const TodoUpdateBodySchema = z.object({
  title,
  description,
  completed,
});

export const TodosListSchema = z.array(TodoSchema);

export type TodoCreateBody = z.infer<typeof TodoCreateBodySchema>;
export type TodoUpdateBody = z.infer<typeof TodoUpdateBodySchema>;
export type Todo = z.infer<typeof TodoSchema>;
export type TodoId = z.infer<typeof id>;
export type TodosList = z.infer<typeof TodosListSchema>;
