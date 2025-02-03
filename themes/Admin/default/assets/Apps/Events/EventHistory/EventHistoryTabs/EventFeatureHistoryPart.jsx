export const eventFeatureHistoryPart = {
    blocks: [
        {
            type: 'block',
            keyId: 'block-features',
            title: 'Attributs',
            fields: [
                {
                    name: 'featureLinks',
                    label: 'Attributs',
                    inputType: 'collection',
                    fields: [
                        {
                            name: 'feature',
                            label: 'Attribut',
                            inputType: 'feature',
                        },

                        {
                            name: 'featureValue',
                            label: "Valeur de l'attribut",
                            inputType: 'featureValue',
                        },

                        {
                            name: 'featureValueRaw',
                            label: 'Valeur personnalisée',
                            inputType: 'text',
                        },
                    ],
                },
            ],
        },
    ],
};
