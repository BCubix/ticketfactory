import React from 'react';
import { RenderModifiedFields } from '../PageContentHistory';
import { Component } from '@/AdminService/Component';

export const CollectionDifferenceType = ({ actualVersion, previousVersion, nextVersion, type, index, ...props }) => {
    return (
        <Component.CmtFormBlock key={index} title={type.title}>
            {Object.entries(actualVersion).map(([itemKey, itemValue]) => (
                <Component.CmtFormBlock key={index}>
                    <RenderModifiedFields
                        actualVersion={itemValue}
                        previousVersion={previousVersion ? previousVersion[itemKey] || null : null}
                        nextVersion={nextVersion ? nextVersion[itemKey] || null : null}
                        blockType={type.parameters.fields}
                        displayGroupHeader={false}
                        {...props}
                    />
                </Component.CmtFormBlock>
            ))}
        </Component.CmtFormBlock>
    );
};
