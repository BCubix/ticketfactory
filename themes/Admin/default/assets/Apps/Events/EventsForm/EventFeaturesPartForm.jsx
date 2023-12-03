import React from 'react';

import { Component } from '@/AdminService/Component';

export const LIST = {
    blocks: [
        {
            keyId: 'block-features',
            title: 'Attributs',

            fields: [
                {
                    style: { xs: 12 },
                    keyId: 'product-features',
                    component: (props) => <Component.CmtFeaturesInputField {...props} />,
                },
            ],
        },
    ],
};

export const EventFeaturesPartForm = ({ ...props }) => <Component.CmtDisplayBlocks blocks={LIST.blocks} {...props} />;
