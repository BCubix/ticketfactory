import React from 'react';
import { Component } from '@/AdminService/Component';

export const DisplayEventHistoryBlock = ({ blocks, actualVersion, ...inheritedProps }) => {
    const checkDisplayBlock = (block) => {
        let keys = Object.keys(actualVersion);

        return block.fields?.some((field) => {
            return keys.includes(field.name);
        });
    };

    return blocks.map((block, index) => {
        const { keyId, title, fields, ...blockProps } = block;

        if (!checkDisplayBlock(block)) {
            return null;
        }

        return (
            <Component.CmtFormBlock key={index} title={title} {...blockProps}>
                <Component.DisplayEventHistoryFields fields={fields} actualVersion={actualVersion} {...inheritedProps} />
            </Component.CmtFormBlock>
        );
    });
};
