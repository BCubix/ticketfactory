import React from 'react';
import { Component } from '@/AdminService/Component';

export const CollectionDifferenceType = ({ actualVersion, previousVersion, nextVersion, type, index, ...props }) => {
    return (
        <Component.CmtFormBlock key={index} title={type.title}>
            {Object.entries(actualVersion).map(([itemKey, itemValue]) => (
                <Component.CmtFormBlock key={index}></Component.CmtFormBlock>
            ))}
        </Component.CmtFormBlock>
    );
};
