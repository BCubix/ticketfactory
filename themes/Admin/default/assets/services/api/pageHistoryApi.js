import axios from '@Services/api/config';

const pageHistoryApi = {
    getOnePageHistory: async (id) => {
        try {
            const pageHistory = [
                {
                    id: 10760,
                    entityKeyword: 'page',
                    entityId: 9,
                    revisionDate: '2021-01-01T10:54:08+01:00',
                    fields: {
                        title: {
                            before: 'Ceci est le titre.',
                            after: 'Ceci est le nouveau titre.',
                        },
                        active: {
                            before: false,
                            after: true,
                        },
                    },
                },
                {
                    id: 10761,
                    entityKeyword: 'page',
                    entityId: 9,
                    revisionDate: '2021-01-01T10:54:15+01:00',
                    fields: {
                        title: {
                            before: 'Ceci est le titrekQDHGFQD<.',
                            after: 'Ceci est le nouveau titre.',
                        },
                        active: {
                            before: false,
                            after: true,
                        },
                    },
                },
                {
                    id: 10760,
                    entityKeyword: 'page',
                    entityId: 9,
                    revisionDate: '2021-01-02T10:54:08+01:00',
                    fields: {
                        title: {
                            before: 'Ceci est le titre.',
                            after: 'Ceci est le nouveau titre.',
                        },
                        active: {
                            before: false,
                            after: true,
                        },
                    },
                },
                {
                    id: 10760,
                    entityKeyword: 'page',
                    entityId: 9,
                    revisionDate: '2021-01-04T10:54:08+01:00',
                    fields: {
                        title: {
                            before: 'Ceci est le titre.',
                            after: 'Ceci est le nouveau titre.',
                        },
                        active: {
                            before: false,
                            after: true,
                        },
                    },
                },
                {
                    id: 10760,
                    entityKeyword: 'page',
                    entityId: 9,
                    revisionDate: '2021-01-07T10:54:08+01:00',
                    fields: {
                        title: {
                            before: 'Ceci est le titre.',
                            after: 'Ceci est le nouveau titre.',
                        },
                        active: {
                            before: false,
                            after: true,
                        },
                    },
                },
                {
                    id: 10760,
                    entityKeyword: 'page',
                    entityId: 9,
                    revisionDate: '2021-01-11T10:54:08+01:00',
                    fields: {
                        title: {
                            before: 'Ceci est le titre.',
                            after: 'Ceci est le nouveau titre.',
                        },
                        active: {
                            before: false,
                            after: true,
                        },
                    },
                },
                {
                    id: 10760,
                    entityKeyword: 'page',
                    entityId: 9,
                    revisionDate: '2021-01-16T10:54:08+01:00',
                    fields: {
                        title: {
                            before: 'Ceci est le titre.',
                            after: 'Ceci est le nouveau titre.',
                        },
                        active: {
                            before: false,
                            after: true,
                        },
                    },
                },
                {
                    id: 10760,
                    entityKeyword: 'page',
                    entityId: 9,
                    revisionDate: '2021-01-22T10:54:08+01:00',
                    fields: {
                        title: {
                            before: 'Ceci est le titre.',
                            after: 'Ceci est le nouveau titre.',
                        },
                        active: {
                            before: false,
                            after: true,
                        },
                    },
                },
                {
                    id: 10760,
                    entityKeyword: 'page',
                    entityId: 9,
                    revisionDate: '2021-01-29T10:54:08+01:00',
                    fields: {
                        title: {
                            before: 'Ceci est le titre.',
                            after: 'Ceci est le nouveau titre.',
                        },
                        active: {
                            before: false,
                            after: true,
                        },
                    },
                },
                {
                    id: 10760,
                    entityKeyword: 'page',
                    entityId: 9,
                    revisionDate: '2021-05-29T10:54:08+01:00',
                    fields: {
                        title: {
                            before: 'Ceci est le titre.',
                            after: 'Ceci est le nouveau titre.',
                        },
                        active: {
                            before: false,
                            after: true,
                        },
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
