'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Pin, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useNotes, useCreateNote, useToggleNotePin, useDeleteNote } from '@/lib/api/hooks/useContacts';
import { formatDistanceToNow } from 'date-fns';

interface NotesListProps {
  contactId: string;
}

export function NotesList({ contactId }: NotesListProps) {
  const [newNoteContent, setNewNoteContent] = useState('');

  const { notes, isLoading, refetch } = useNotes(contactId);
  const { createNote, isLoading: isCreating } = useCreateNote();
  const { togglePin, isLoading: isToggling } = useToggleNotePin();
  const { deleteNote, isLoading: isDeleting } = useDeleteNote();

  const handleCreateNote = async () => {
    if (!newNoteContent.trim()) {
      toast.error('Note content cannot be empty');
      return;
    }

    try {
      await createNote({ contact: contactId, content: newNoteContent });
      toast.success('Note created successfully');
      setNewNoteContent('');
      refetch();
    } catch (error) {
      toast.error('Failed to create note');
      // error already shown via toast
    }
  };

  const handleTogglePin = async (noteId: string) => {
    try {
      await togglePin(noteId);
      toast.success('Note pin status updated');
      refetch();
    } catch (error) {
      toast.error('Failed to update pin status');
      // error already shown via toast
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await deleteNote(noteId);
      toast.success('Note deleted successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to delete note');
      // error already shown via toast
    }
  };

  // Sort notes: pinned first, then by creation date (newest first)
  const sortedNotes = [...notes].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Create Note Form */}
      <Card>
        <CardHeader>
          <CardTitle>Add Note</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="new-note">Note Content</Label>
            <Textarea
              id="new-note"
              placeholder="Type your note here..."
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              className="min-h-24"
              disabled={isCreating}
            />
          </div>
          <Button
            onClick={handleCreateNote}
            disabled={isCreating || !newNoteContent.trim()}
            size="sm"
          >
            {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Add Note
          </Button>
        </CardContent>
      </Card>

      {/* Notes List */}
      <div className="space-y-3">
        {sortedNotes.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-sm text-muted-foreground">
                No notes yet. Add one to get started.
              </p>
            </CardContent>
          </Card>
        ) : (
          sortedNotes.map((note) => (
            <Card key={note.id} className={note.pinned ? 'ring-2 ring-primary/20' : ''}>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-sm">
                        {note.author?.username || 'Unknown'}
                      </CardTitle>
                      {note.pinned && (
                        <Pin className="h-3.5 w-3.5 fill-primary text-primary" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(note.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => handleTogglePin(note.id)}
                      disabled={isToggling}
                      title={note.pinned ? 'Unpin note' : 'Pin note'}
                    >
                      <Pin
                        className={`h-3.5 w-3.5 ${
                          note.pinned ? 'fill-primary text-primary' : ''
                        }`}
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => handleDeleteNote(note.id)}
                      disabled={isDeleting}
                      title="Delete note"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{note.content}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
