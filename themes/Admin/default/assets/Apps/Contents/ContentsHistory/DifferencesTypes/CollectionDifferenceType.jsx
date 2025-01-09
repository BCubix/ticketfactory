import React from 'react';
import { Component } from '@/AdminService/Component';
import { RenderModifiedFields } from '../DisplayContentDifferences';

export const CollectionDifferenceType = ({ actualVersion, previousVersion, nextVersion, type, index, ...props }) => {
    return (
        <Component.CmtFormBlock key={index} title={type.title}>
            {Object.entries(actualVersion).map(([itemKey, itemValue]) => {
                return (
                    <Component.CmtFormBlock key={itemKey}>
                        <RenderModifiedFields
                            actualVersion={itemValue}
                            previousVersion={previousVersion ? previousVersion[itemKey] || null : null}
                            nextVersion={nextVersion ? nextVersion[itemKey] || null : null}
                            contentType={type.parameters.fields}
                            displayGroupHeader={false}
                            {...props}
                        />
                    </Component.CmtFormBlock>
                );
            })}
        </Component.CmtFormBlock>
    );
};
