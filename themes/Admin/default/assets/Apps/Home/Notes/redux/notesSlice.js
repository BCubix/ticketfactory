import { createSlice } from '@reduxjs/toolkit';
import { Api } from '@/AdminService/Api';

export const notesSlice = createSlice({
    name: 'notes',
    initialState: {
        notes: null,
        loadingNotes: false,
        errorNotes: null,
    },
    reducers: {
        setNotes: (state, action) => {
            state.notes = action.payload;
        },
        updateNote: (state, action) => {
            state.notes = action.payload;
        },
        setLoading: (state, action) => {
            state.loadingNotes = action.payload;
        },
        setError: (state, action) => {
            state.errorNotes = action.payload;
        },
    },
});

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

export const editNote = (noteId, noteData) => async dispatch => {
    try {
        const response = await Api.notesApi.editNote(noteId, noteData);
        dispatch(updateNote(response.data));
    } catch (error) {
        dispatch(setError(error.message));
    }
};

export const {
    setNotes,
    updateNote,
    setLoading,
    setError,
} = notesSlice.actions;
export const notesSelector = (state) => state.notes;
export default notesSlice.reducer;
