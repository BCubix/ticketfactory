import axios from '@Services/api/config';

const NOTES_BASE_PATH = '/note';

const notesApi = {
    getNotes: async () => {
        const result = await axios.get(NOTES_BASE_PATH);
        return result;
    },

    editNote: async (noteId, noteData) => {
        const result = await axios.post(`${NOTES_BASE_PATH}/${noteId}`, noteData);
        return result;
    },

};

export default notesApi;
