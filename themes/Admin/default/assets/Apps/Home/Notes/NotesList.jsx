import React, { useState, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { fetchNotes, deleteNote, updateNote } from '@Apps/Home/Notes/redux/notesSlice';

import { Api } from '@/AdminService/Api';

import { Button, IconButton, TextField, List, ListItem, ListItemText, ListItemSecondaryAction } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';


export const NotesList = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchNotes());
    }, [dispatch]);

    const notes = useSelector(state => state?.notes?.notes || []);
    const loading = useSelector(state => state?.notes?.loading);
    const error = useSelector(state => state?.notes?.error);

    const [newNote, setNewNote] = useState('');
    const [editingNoteId, setEditingNoteId] = useState(null);
    const [editedMessage, setEditedMessage] = useState('');

    const handleDeleteNote = (id) => {
        dispatch(deleteNote(id));
    };

    const handleEditNote = (id, message) => {
        setEditingNoteId(id);
        setEditedMessage(message);
    };

    const handleSaveEdit = () => {
        if (editedMessage.trim()) {
            dispatch(updateNote({ id: editingNoteId, message: editedMessage }));
            setEditingNoteId(null);
            setEditedMessage('');
        }
    };

    const handleAddNote = async () => {
        if (newNote.trim() === '') {
            return;
        }
    
        const result = await Api.notesApi.createNote(newNote);
        
        // ensure synchronization
        dispatch(fetchNotes());
    
        setNewNote('');
    };
    
    if (loading) return <div>Chargement...</div>;
    if (error) return <div>Erreur: {error}</div>;

    return (
        <div>
            <h2>Notes</h2>
            <List>
                {notes.map(note => (
                    <ListItem key={note.id}>
                        {editingNoteId === note.id ? (
                            <>
                                <TextField
                                    value={editedMessage}
                                    onChange={(e) => setEditedMessage(e.target.value)}
                                    label="Edit Note"
                                    fullWidth
                                />
                                <Button onClick={handleSaveEdit}>Enregistrer</Button>
                            </>
                        ) : (
                            <>
                                <ListItemText primary={note.message} />
                                <ListItemSecondaryAction>
                                    <IconButton edge="end" onClick={() => handleEditNote(note.id, note.message)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton edge="end" onClick={() => handleDeleteNote(note.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </>
                        )}
                    </ListItem>
                ))}
            </List>
            <div>
                <TextField
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    label="Ajout"
                    fullWidth
                />
                <Button onClick={handleAddNote}>Ajouter une note</Button>
            </div>
        </div>
    );
};
