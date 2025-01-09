export const eventDateHistoryPart = {
    blocks: [
        {
            type: 'block',
            keyId: 'block-dates',
            title: 'Dates',
            fields: [
                {
                    name: 'eventDates',
                    label: 'Dates',
                    inputType: 'collection',
                    fields: [
                        {
                            name: 'eventDate',
                            label: 'Date',
                            inputType: 'datetime',
                        },
                        {
                            name: 'annotation',
                            label: 'Annotation',
                            inputType: 'text',
                        },
                        {
                            name: 'state',
                            label: 'Statut',
                            inputType: 'choice',
                            choices: [
                                { label: 'Valide', value: 'valid' },
                                { label: 'Reporté', value: 'delayed' },
                                { label: 'Annulé', value: 'canceled' },
                                { label: 'Nouvelle date', value: 'new_date' },
                            ],
                        },
                        {
                            name: 'reportDate',
                            label: 'Date de report',
                            inputType: 'datetime',
                        },
                    ],
                },
            ],
        },
    ],
};
