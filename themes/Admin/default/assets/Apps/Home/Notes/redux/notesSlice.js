import { createSlice } from '@reduxjs/toolkit';
import { Api } from '@/AdminService/Api';

export const notesSlice = createSlice({
    name: 'notes',
    initialState: {
        notes: [],
        loading: false,
        error: null,
    },
    reducers: {
        setNotes: (state, action) => {
            state.notes = action.payload;
        },
        addNote: (state, action) => {
            state.notes.push(action.payload);
        },
        updateNote: (state, action) => {
            const index = state.notes.findIndex(note => note.id === action.payload.id);
            if (index !== -1) {
                state.notes[index] = action.payload;
            }
        },
        removeNote: (state, action) => {
            state.notes = state.notes.filter(note => note.id !== action.payload.id);
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const {
    setNotes,
    addNote,
    updateNote,
    removeNote,
    setLoading,
    setError,
} = notesSlice.actions;

export const fetchNotes = () => async dispatch => {
    dispatch(setLoading(true));
    try {
        const response = await Api.notesApi.getNotes();
        dispatch(setNotes(response.data));
    } catch (error) {
        dispatch(setError(error.message));
    } finally {
        dispatch(setLoading(false));
    }
};

export const createNote = (noteData) => async dispatch => {
    try {
        const response = await Api.notesApi.createNote(noteData);
        dispatch(addNote(response.data));
    } catch (error) {
        dispatch(setError(error.message));
    }
};

export const editNote = (noteId, noteData) => async dispatch => {
    try {
        const response = await Api.notesApi.editNote(noteId, noteData);
        dispatch(updateNote(response.data));
    } catch (error) {
        dispatch(setError(error.message));
    }
};

export const deleteNote = (noteId) => async dispatch => {
    try {
        await Api.notesApi.deleteNote(noteId);
        dispatch(removeNote({ id: noteId }));  // Use 'removeNote' here
    } catch (error) {
        dispatch(setError(error.message));
    }
};

export default notesSlice.reducer;
