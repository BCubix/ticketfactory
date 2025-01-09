import axios from '@Services/api/config';

const NOTES_BASE_PATH = '/note';

const notesApi = {
    getNotes: async () => {
        const result = await axios.get(NOTES_BASE_PATH);
        return result;
    },
    
    createNote: async (noteData) => {
        const result = await axios.post(NOTES_BASE_PATH, noteData);
        return result;
    },

    editNote: async (noteId, noteData) => {
        const result = await axios.post(`${NOTES_BASE_PATH}/${noteId}`, noteData);
        return result;
    },

    deleteNote: async (noteId) => {
        const result = await axios.delete(`${NOTES_BASE_PATH}/${noteId}`);
        return result;
    },
};

export default notesApi;
