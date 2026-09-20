import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Note } from '@/types';

const NOTES_KEY = 'casefile_notes';
const CONCLUSION_KEY = 'casefile_conclusion';

export async function getNotes(): Promise<Note[]> {
  try {
    const raw = await AsyncStorage.getItem(NOTES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Identity is the note id; two notes written in the same second are still two notes.
    const deduplicated = parsed.filter(
      (note: Note, index: number, self: Note[]) =>
        self.findIndex((t) => t.id === note.id) === index
    );
    return deduplicated as Note[];
  } catch {
    return [];
  }
}

export async function saveNotes(notes: Note[]): Promise<void> {
  try {
    await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  } catch {
    // Fail silently — UI state is the source of truth
  }
}

export async function getConclusion(): Promise<string | null> {
  try {
    const raw = await AsyncStorage.getItem(CONCLUSION_KEY);
    return raw ?? null;
  } catch {
    return null;
  }
}

export async function saveConclusion(suspectId: string | null): Promise<void> {
  try {
    if (suspectId === null) {
      await AsyncStorage.removeItem(CONCLUSION_KEY);
    } else {
      await AsyncStorage.setItem(CONCLUSION_KEY, suspectId);
    }
  } catch {
    // Fail silently
  }
}
