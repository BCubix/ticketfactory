export const eventPriceHistoryPart = {
    blocks: [
        {
            type: 'block',
            keyId: 'block-prices',
            title: 'Prix',
            fields: [
                {
                    name: 'eventPriceCategories',
                    label: 'Catégorie de tarifs',
                    inputType: 'collection',
                    fields: [
                        {
                            name: 'name',
                            label: 'Nom de la catégorie',
                            inputType: 'text',
                        },
                        {
                            name: 'eventPrices',
                            label: 'Tarif',
                            inputType: 'collection',
                            fields: [
                                {
                                    name: 'name',
                                    label: 'Nom',
                                    inputType: 'text',
                                },
                                {
                                    name: 'price',
                                    label: 'Prix',
                                    inputType: 'number',
                                },
                                {
                                    name: 'annotation',
                                    label: 'Annotation',
                                    inputType: 'text',
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
};
