import React from 'react';
import { Component } from '@/AdminService/Component';

export const DisplayEventHistoryBlock = ({ blocks, ...inheritedProps }) => {
    return blocks.map((block, index) => {
        const { keyId, title, fields, ...blockProps } = block;

        return (
            <Component.CmtFormBlock key={index} title={title} {...blockProps}>
                <Component.DisplayEventHistoryFields fields={fields} {...inheritedProps} />
            </Component.CmtFormBlock>
        );
    });
};
