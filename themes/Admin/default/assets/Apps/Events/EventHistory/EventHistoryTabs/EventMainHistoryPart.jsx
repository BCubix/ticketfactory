export const eventMainHistoryPart = {
    blocks: [
        {
            type: 'block',
            keyId: 'block-general-info',
            title: 'Informations générales',
            fields: [
                {
                    name: 'name',
                    label: 'Nom',
                    inputType: 'text',
                },

                {
                    name: 'chapo',
                    label: 'Chapô',
                    inputType: 'text',
                },

                {
                    name: 'description',
                    label: 'Description',
                    inputType: 'wysiwyg',
                },

                {
                    name: 'room',
                    label: 'Salle',
                    inputType: 'room',
                },

                {
                    name: 'seatingPlan',
                    label: 'Plan de salle',
                    inputType: 'seatingPlan',
                },

                {
                    name: 'season',
                    label: 'Saison',
                    inputType: 'season',
                },

                {
                    name: 'eventType',
                    label: "Type d'évènement",
                    inputType: 'eventType',
                },
            ],
        },

        {
            type: 'block',
            keyId: 'block-annexe-info',
            title: 'Informations annexes',
            fields: [
                {
                    name: 'ticketing',
                    label: 'Billetterie',
                    inputType: 'ticketing',
                },

                {
                    name: 'ticketingReference',
                    label: 'Identifiant billetterie',
                    inputType: 'text',
                },

                {
                    name: 'displayBookingButton',
                    label: 'Afficher le bouton de réservation',
                    inputType: 'boolean',
                },

                {
                    name: 'eventLength',
                    label: "Durée de l'évènement (en minutes)",
                    inputType: 'text',
                },
            ],
        },

        {
            type: 'block',
            keyId: 'block-categories',
            title: 'Catégories',
            fields: [
                { name: 'mainCategory', label: 'Categorie principale', inputType: 'category' },
                { name: 'eventCategories', label: 'Catégories', inputType: 'collection', fields: [{ label: 'Catégorie', inputType: 'category' }] },
                { name: 'tags', label: 'Tags', inputType: 'collection', fields: [{ label: 'Tag', inputType: 'tag' }] },
            ],
        },
    ],
};
