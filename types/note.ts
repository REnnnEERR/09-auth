// 

export type NoteTag = 'Work' | 'Personal' | 'Home' | 'Other'; // або ті теги, які використовує API

export interface Note {
  id: string;
  title: string;
  content: string;
  tag: NoteTag; // або просто string, якщо не хочеш морочитися з юніоном
  createdAt: string;
  updatedAt: string;
}