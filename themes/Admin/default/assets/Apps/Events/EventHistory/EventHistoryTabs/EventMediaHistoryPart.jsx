export const eventMediaHistoryPart = {
    blocks: [
        {
            type: 'block',
            keyId: 'block-medias',
            title: 'Medias',
            fields: [
                {
                    name: 'eventMedias',
                    label: 'Médias',
                    inputType: 'collection',
                    fields: [
                        {
                            name: 'media',
                            label: 'Média',
                            inputType: 'image',
                        },
                    ],
                },
            ],
        },
    ],
};
