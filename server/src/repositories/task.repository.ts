import { and, eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { tasks } from "../db/schema.js";

export const taskRepository = {
  async create(data: { title: string; description?: string; userId: string }) {
    const [task] = await db
      .insert(tasks)
      .values({
        title: data.title,
        description: data.description,
        userId: data.userId,
      })
      .returning();

    return task;
  },

  async findById(id: string) {
    const [task] = await db
      .select()
      .from(tasks)
      .where(eq(tasks.id, id))
      .limit(1);

    return task ?? null;
  },

  async findByIdAndUserId(id: string, userId: string) {
    const [task] = await db
      .select()
      .from(tasks)
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
      .limit(1);

    return task ?? null;
  },

  async findByUserId(userId: string) {
    return db.select().from(tasks).where(eq(tasks.userId, userId));
  },

  async updateByIdAndUserId(
    id: string,
    userId: string,
    data: {
      title?: string;
      description?: string;
    },
  ) {
    const [task] = await db
      .update(tasks)
      .set(data)
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
      .returning();

    return task ?? null;
  },

  async deleteByIdAndUserId(id: string, userId: string) {
    const [task] = await db
      .delete(tasks)
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
      .returning();

    return task ?? null;
  },
};
