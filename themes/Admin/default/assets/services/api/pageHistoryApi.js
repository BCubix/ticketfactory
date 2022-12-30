import axios from '@Services/api/config';

const pageHistoryApi = {
    getOnePageHistory: async (id) => {
        try {
            const pageHistory = [
                {
                    id: 10760,
                    entityKeyword: 'page',
                    entityId: 9,
                    revisionDate: '2022-12-21T10:54:08+01:00',
                    fields: {
                        title: ['Ceci est le titre.', 'Ceci est le nouveau titre.'],
                        active: [false, true],
                    },
                },
                {
                    id: 10766,
                    entityKeyword: 'page',
                    entityId: 9,
                    revisionDate: '2022-12-21T11:04:14+01:00',
                    fields: {
                        name: ['Nouvel Evénement', 'Nouvel Evénement bis'],
                        slug: ['nouvel-evenement', 'nouvel-evenement-bis'],
                    },
                },
            ];

            return { result: true, pageHistory: pageHistory };
            const result = await axios.get(`/pages/${id}`);

            return { result: true, pageHistory: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    restoreHistory: async (id) => {
        try {
            const result = await axios.post(`/history/page/${id}`);

            return { result: true, pageHistory: result?.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default pageHistoryApi;
