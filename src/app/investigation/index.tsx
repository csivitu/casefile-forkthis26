import { PageHeader } from '@/components/casefile/PageHeader';
import { SectionHeader } from '@/components/casefile/SectionHeader';
import { C, Fonts } from '@/constants/theme';
import { CASE, SUSPECTS } from '@/data/case';
import { getConclusion, getNotes, saveConclusion, saveNotes } from '@/storage/storage';
import type { Note } from '@/types';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch {
    return iso;
  }
}

export default function InvestigationScreen() {
  const router = useRouter();

  // ── Notes state ──
  const [notes, setNotes] = useState<Note[]>([]);
  // guards the save effect until the stored notes have actually been read back
  const [notesLoaded, setNotesLoaded] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  // ── Conclusion state ──
  const [selectedSuspectId, setSelectedSuspectId] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // ── Load from AsyncStorage ──
  useEffect(() => {
    let active = true;
    getNotes().then((loaded) => {
      if (active) {
        setNotes(loaded);
        setNotesLoaded(true);
      }
    });
    getConclusion().then((suspectId) => {
      if (active && suspectId) {
        setSelectedSuspectId(suspectId);
        setSubmitted(true);
      }
    });
    return () => { active = false; };
  }, []);

  // ── Notes operations ──
  useEffect(() => {
    if (!notesLoaded) return;
    saveNotes(notes);
  }, [notes, notesLoaded]);

  const addNote = useCallback((note: Note) => {
    const updated = [...notes, note];
    setNotes(updated);
  }, []);

  const updateNote = useCallback((id: string, text: string) => {
    const now = new Date().toISOString();
    const updated = notes.map((n) =>
      n.id === id ? { ...n, text, updatedAt: now } : n
    );
    setNotes(updated);
  }, []);

  const deleteNote = useCallback((id: string) => {
    const updated = notes.filter((n) => n.id !== id);
    setNotes(updated);
  }, []);

  function handleAddNote() {
    if (!newNoteText.trim()) return;
    const now = new Date().toISOString();
    const note: Note = {
      id: generateId(),
      text: newNoteText.trim(),
      createdAt: now,
      updatedAt: now,
    };
    addNote(note);
    setNewNoteText('');
  }

  function handleStartEdit(note: Note) {
    setEditingId(note.id);
    setEditText(note.text);
  }

  function handleSaveEdit() {
    if (!editText.trim() || !editingId) return;
    updateNote(editingId, editText.trim());
    setEditingId(null);
    setEditText('');
  }

  function handleCancelEdit() {
    setEditingId(null);
    setEditText('');
  }

  function handleDeleteNote(id: string) {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteNote(id),
        },
      ]
    );
  }

  // ── Conclusion operations ──
  function handleSubmitConclusion() {
    if (!selectedSuspectId) {
      Alert.alert('No Suspect Selected', 'Please select a suspect before submitting your conclusion.');
      return;
    }
    saveConclusion(selectedSuspectId);
    setSubmitted(true);
  }

  function handleReviseConclusion() {
    setSubmitted(false);
    saveConclusion(null);
  }

  const concludedSuspect = submitted
    ? SUSPECTS.find((s) => s.id === selectedSuspectId) ?? null
    : null;

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <PageHeader
          title="Investigation"
          subtitle={`Case #${CASE.id}`}
          onBack={() => (router.canGoBack() ? router.back() : router.replace('/overview') as never)}
          backLabel="Overview"
        />
      </SafeAreaView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── NOTES ── */}
        <SectionHeader title="Notes" />

        <View style={styles.notesContainer}>
          {notes.length === 0 && (
            <Text style={styles.noNotesText}>No notes yet.</Text>
          )}

          {notes.map((note) => (
            <View key={note.id} style={styles.noteCard}>
              {editingId === note.id ? (
                /* Edit mode */
                <View style={styles.editContainer}>
                  <TextInput
                    style={styles.editInput}
                    value={editText}
                    onChangeText={setEditText}
                    placeholder="Edit note…"
                    placeholderTextColor={C.faded}
                    multiline
                    autoFocus
                  />
                  <View style={styles.editActions}>
                    <TouchableOpacity
                      style={styles.primaryButton}
                      onPress={handleSaveEdit}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.primaryButtonText}>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.secondaryButton}
                      onPress={handleCancelEdit}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.secondaryButtonText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                /* View mode */
                <View>
                  <Text style={styles.noteText}>{note.text}</Text>
                  <View style={styles.noteMeta}>
                    <Text style={styles.noteTimestamp}>
                      {note.updatedAt !== note.createdAt ? 'Edited ' : ''}
                      {formatDate(note.updatedAt)}
                    </Text>
                    <View style={styles.noteActions}>
                      <TouchableOpacity onPress={() => handleStartEdit(note)} activeOpacity={0.7}>
                        <Text style={styles.editLink}>Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleDeleteNote(note.id)} activeOpacity={0.7}>
                        <Text style={styles.deleteLink}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
            </View>
          ))}

          {/* Add note form */}
          <View style={styles.addNoteContainer}>
            <TextInput
              style={styles.addNoteInput}
              value={newNoteText}
              onChangeText={setNewNoteText}
              placeholder="Add a new note…"
              placeholderTextColor={C.faded}
              multiline
            />
            <View style={styles.addNoteActions}>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleAddNote}
                activeOpacity={0.8}
              >
                <Text style={styles.secondaryButtonText}>Add Note</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.spacer} />

        {/* ── CONCLUSION ── */}
        <SectionHeader title="Conclusion" />

        <View style={styles.conclusionContainer}>
          {submitted && concludedSuspect ? (
            /* Submitted result */
            <View style={styles.conclusionResult}>
              <Text style={styles.conclusionSubmittedLabel}>Conclusion Submitted</Text>
              <Text style={styles.conclusionSuspectName}>{concludedSuspect.name}</Text>
              <Text style={styles.conclusionSuspectOccupation}>{concludedSuspect.occupation}</Text>
              <TouchableOpacity
                style={[styles.secondaryButton, { marginTop: 14 }]}
                onPress={handleReviseConclusion}
                activeOpacity={0.8}
              >
                <Text style={styles.secondaryButtonText}>Revise</Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* Selection form */
            <View>
              <Text style={styles.conclusionPrompt}>
                Who was responsible for the disappearance of the prototype?
              </Text>
              <View style={styles.suspectList}>
                {SUSPECTS.map((s) => {
                  const isSelected = selectedSuspectId === s.id;
                  return (
                    <TouchableOpacity
                      key={s.id}
                      style={[styles.suspectOption, isSelected && styles.suspectOptionSelected]}
                      onPress={() => setSelectedSuspectId(s.id)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.suspectOptionLeft}>
                        <Text style={[styles.suspectOptionName, isSelected && styles.suspectOptionNameSelected]}>
                          {s.name}
                        </Text>
                        <Text style={[styles.suspectOptionRole, isSelected && styles.suspectOptionRoleSelected]}>
                          {s.occupation}
                        </Text>
                      </View>
                      <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                        {isSelected && <View style={styles.radioInner} />}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmitConclusion}
                activeOpacity={0.8}
              >
                <Text style={styles.submitButtonText}>Submit Conclusion</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.bottomPad} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.parchment,
  },
  safe: {
    backgroundColor: C.paper,
  },
  scrollContent: {},
  // ── Notes ──
  notesContainer: {
    padding: 14,
    gap: 10,
  },
  noNotesText: {
    fontFamily: Fonts?.sans ?? 'normal',
    fontSize: 13,
    color: C.faded,
  },
  noteCard: {
    backgroundColor: C.paper,
    borderWidth: 1,
    borderColor: C.divider,
    borderRadius: 3,
    padding: 12,
  },
  noteText: {
    fontFamily: Fonts?.sans ?? 'normal',
    fontSize: 14,
    color: C.ink,
    lineHeight: 22,
    marginBottom: 8,
  },
  noteMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noteTimestamp: {
    fontFamily: Fonts?.mono ?? 'monospace',
    fontSize: 10,
    color: C.antique,
  },
  noteActions: {
    flexDirection: 'row',
    gap: 12,
  },
  editLink: {
    fontFamily: Fonts?.sans ?? 'normal',
    fontSize: 12,
    fontWeight: '600',
    color: C.leather,
  },
  deleteLink: {
    fontFamily: Fonts?.sans ?? 'normal',
    fontSize: 12,
    fontWeight: '600',
    color: C.brick,
  },
  editContainer: {
    gap: 8,
  },
  editInput: {
    backgroundColor: C.parchment,
    borderWidth: 1,
    borderColor: C.divider,
    borderRadius: 3,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: Fonts?.sans ?? 'normal',
    fontSize: 14,
    color: C.ink,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  editActions: {
    flexDirection: 'row',
    gap: 8,
  },
  addNoteContainer: {
    marginTop: 4,
    gap: 8,
  },
  addNoteInput: {
    backgroundColor: C.paper,
    borderWidth: 1,
    borderColor: C.divider,
    borderRadius: 3,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: Fonts?.sans ?? 'normal',
    fontSize: 14,
    color: C.ink,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  addNoteActions: {
    flexDirection: 'row',
  },
  // ── Shared buttons ──
  primaryButton: {
    backgroundColor: C.walnut,
    borderRadius: 3,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontFamily: Fonts?.sans ?? 'normal',
    fontSize: 14,
    fontWeight: '600',
    color: C.paper,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderRadius: 3,
    borderWidth: 1,
    borderColor: C.leather,
    paddingHorizontal: 18,
    paddingVertical: 9,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontFamily: Fonts?.sans ?? 'normal',
    fontSize: 13,
    fontWeight: '600',
    color: C.leather,
  },
  spacer: { height: 16 },
  // ── Conclusion ──
  conclusionContainer: {
    padding: 14,
  },
  conclusionResult: {
    backgroundColor: C.paper,
    borderWidth: 1,
    borderColor: C.olive,
    borderRadius: 3,
    padding: 16,
  },
  conclusionSubmittedLabel: {
    fontFamily: Fonts?.mono ?? 'monospace',
    fontSize: 10,
    color: C.olive,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  conclusionSuspectName: {
    fontFamily: Fonts?.serif ?? 'serif',
    fontSize: 16,
    fontWeight: '600',
    color: C.walnut,
  },
  conclusionSuspectOccupation: {
    fontFamily: Fonts?.sans ?? 'normal',
    fontSize: 13,
    color: C.faded,
    marginTop: 2,
  },
  conclusionPrompt: {
    fontFamily: Fonts?.sans ?? 'normal',
    fontSize: 14,
    color: C.faded,
    lineHeight: 22,
    marginBottom: 14,
  },
  suspectList: {
    gap: 8,
    marginBottom: 16,
  },
  suspectOption: {
    backgroundColor: C.paper,
    borderWidth: 1,
    borderColor: C.divider,
    borderRadius: 3,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  suspectOptionSelected: {
    backgroundColor: C.walnut,
    borderColor: C.walnut,
  },
  suspectOptionLeft: {
    flex: 1,
    marginRight: 8,
  },
  suspectOptionName: {
    fontFamily: Fonts?.serif ?? 'serif',
    fontSize: 15,
    fontWeight: '600',
    color: C.walnut,
  },
  suspectOptionNameSelected: {
    color: C.paper,
  },
  suspectOptionRole: {
    fontFamily: Fonts?.sans ?? 'normal',
    fontSize: 12,
    color: C.faded,
    marginTop: 2,
  },
  suspectOptionRoleSelected: {
    color: C.antique,
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: C.divider,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  radioOuterSelected: {
    borderColor: C.antique,
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: C.antique,
  },
  submitButton: {
    backgroundColor: C.walnut,
    borderRadius: 3,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitButtonText: {
    fontFamily: Fonts?.sans ?? 'normal',
    fontSize: 15,
    fontWeight: '600',
    color: C.paper,
    letterSpacing: 0.3,
  },
  bottomPad: { height: 40 },
});
