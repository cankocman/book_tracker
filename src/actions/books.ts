
"use server";

import { db } from "../db";
import { books, notes, readingSessions } from "../db/schema";
import { auth } from "../lib/auth";
import { eq, and, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getBooks() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return await db.query.books.findMany({
    where: eq(books.userId, session.user.id),
    orderBy: [desc(books.updatedAt)],
  });
}

export async function getSessions() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return await db.query.readingSessions.findMany({
    where: eq(readingSessions.userId, session.user.id),
    orderBy: [desc(readingSessions.date)],
  });
}

export async function getNotes() {
    const session = await auth();
    if (!session?.user?.id) return [];
  
    return await db.query.notes.findMany({
      where: eq(notes.userId, session.user.id),
      orderBy: [desc(notes.createdAt)],
    });
}

export async function addBook(data: typeof books.$inferInsert) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db.insert(books).values({
    ...data,
    userId: session.user.id,
  });

  revalidatePath("/library");
  revalidatePath("/dashboard");
}

export async function updateBook(id: string, data: Partial<typeof books.$inferInsert>) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db
    .update(books)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(books.id, id), eq(books.userId, session.user.id)));

  revalidatePath("/library");
  revalidatePath("/dashboard");
  revalidatePath(`/book/${id}`);
}

export async function deleteBook(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db.delete(books).where(and(eq(books.id, id), eq(books.userId, session.user.id)));
  
  revalidatePath("/library");
  revalidatePath("/dashboard");
}

export async function addSession(data: typeof readingSessions.$inferInsert) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db.insert(readingSessions).values({
    ...data,
    userId: session.user.id,
  });

  // Also update book progress if needed (this logic was in BookContext)
  // We can do it here or let the client handle it by calling updateBook.
  // Best to do it here for consistency.
  const book = await db.query.books.findFirst({
      where: and(eq(books.id, data.bookId), eq(books.userId, session.user.id))
  });

  if (book) {
      const newPage = Math.min(book.totalPages, (book.currentPage || 0) + data.pagesRead);
      const updates: any = { currentPage: newPage };
      
      if (newPage === book.totalPages && book.status !== 'read') {
        updates.status = 'read';
        updates.finishDate = new Date(); // timestamp
      } else if (book.status === 'want-to-read') {
        updates.status = 'reading';
        updates.startDate = new Date(); // timestamp
      }
      
      await db.update(books).set(updates).where(eq(books.id, book.id));
  }

  revalidatePath("/dashboard");
  revalidatePath(`/book/${data.bookId}`);
}

export async function addNote(data: typeof notes.$inferInsert) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await db.insert(notes).values({
        ...data,
        userId: session.user.id
    });
    
    revalidatePath(`/book/${data.bookId}`);
}

export async function updateNote(id: string, content: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const note = await db.query.notes.findFirst({
        where: and(eq(notes.id, id), eq(notes.userId, session.user.id))
    });
    if (!note) throw new Error("Not found");

    await db.update(notes)
        .set({ content, updatedAt: new Date() })
        .where(eq(notes.id, id));

    revalidatePath(`/book/${note.bookId}`);
}

export async function deleteNote(id: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const note = await db.query.notes.findFirst({
        where: and(eq(notes.id, id), eq(notes.userId, session.user.id))
    });
    if (!note) throw new Error("Not found");

    await db.delete(notes).where(eq(notes.id, id));
    
    revalidatePath(`/book/${note.bookId}`);
}

export async function updateSession(id: string, data: Partial<typeof readingSessions.$inferInsert>) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const existingSession = await db.query.readingSessions.findFirst({
        where: and(eq(readingSessions.id, id), eq(readingSessions.userId, session.user.id))
    });
    if (!existingSession) throw new Error("Not found");

    await db.update(readingSessions)
        .set(data)
        .where(eq(readingSessions.id, id));

    if (data.pagesRead !== undefined && data.pagesRead !== existingSession.pagesRead) {
        const diff = data.pagesRead - existingSession.pagesRead;
        const book = await db.query.books.findFirst({
            where: eq(books.id, existingSession.bookId)
        });
        if (book) {
            const newPage = Math.max(0, Math.min(book.totalPages, (book.currentPage || 0) + diff));
            const updates: any = { currentPage: newPage };
            if (newPage === book.totalPages && book.status !== 'read') {
              updates.status = 'read';
              updates.finishDate = new Date();
            } else if (newPage < book.totalPages && book.status === 'read') {
              updates.status = 'reading';
              updates.finishDate = null;
            }
            await db.update(books).set(updates).where(eq(books.id, book.id));
        }
    }

    revalidatePath("/dashboard");
    revalidatePath(`/book/${existingSession.bookId}`);
}

export async function deleteSession(id: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const existingSession = await db.query.readingSessions.findFirst({
        where: and(eq(readingSessions.id, id), eq(readingSessions.userId, session.user.id))
    });
    if (!existingSession) throw new Error("Not found");

    await db.delete(readingSessions).where(eq(readingSessions.id, id));

    const book = await db.query.books.findFirst({
        where: eq(books.id, existingSession.bookId)
    });
    if (book) {
        const newPage = Math.max(0, (book.currentPage || 0) - existingSession.pagesRead);
        const updates: any = { currentPage: newPage };
        if (newPage < book.totalPages && book.status === 'read') {
          updates.status = 'reading';
          updates.finishDate = null;
        }
        await db.update(books).set(updates).where(eq(books.id, book.id));
    }

    revalidatePath("/dashboard");
    revalidatePath(`/book/${existingSession.bookId}`);
}
