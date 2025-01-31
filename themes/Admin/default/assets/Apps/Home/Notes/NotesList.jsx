import React, { useState, useEffect } from 'react';
import { Component } from '@/AdminService/Component';
import { useDispatch, useSelector } from 'react-redux';
import { editNote } from '@Apps/Home/Notes/redux/notesSlice';
import { Api } from '@/AdminService/Api';
import { Button, Box, TextField, Typography } from '@mui/material';

export const NotesList = ({note, error, loading}) => {
    const [noteContent, setNoteContent] = useState('');

    useEffect(() => {
        if (note !== null) {
            setNoteContent(note?.message || '');
        }
    }, [note]);
    
    const handleSaveNote = async () => {
        if (noteContent.trim() === '') {
            return;
        }

        const noteId = note?.id || null;
        dispatch(editNote(noteId, { id: noteId, message: noteContent }));
    };

    return (
        <Component.CmtCard
            sx={{
                height: '65vh',
                maxWidth: '800px',
                display: 'flex',
                flexDirection: 'column',
                margin: 'auto',
            }}
        >
            <Component.CmtCardHeader title="Notes" />
            <Box>
                <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', padding: "10px" }}>
                    Ceci est un espace dans lequel vous pouvez saisir vos notes pour ne rien oublier.
                </Typography>
            </Box>
            <Box flexGrow={1} display="flex" flexDirection="column" sx={{ padding: '10px', overflow: 'auto' }}>
                <TextField
                    variant="outlined"
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    label="Votre note"
                    fullWidth
                    multiline
                    sx={{
                        flexGrow: 1,
                        '& .MuiInputBase-root': {
                            height: '100%',
                            alignItems: 'flex-start',
                        },
                        '& .MuiInputBase-input': {
                            height: '100%',
                        },
                    }}
                    InputProps={{
                        style: { height: '100%' },
                    }}
                />
            </Box>
            <Box display="flex" justifyContent="center" sx={{ paddingBottom: 4, marginTop: '10px' }}>
                <Button variant="contained" onClick={handleSaveNote} sx={{ padding: "5px" }}>
                    Enregistrer
                </Button>
            </Box>
        </Component.CmtCard>
    );
};