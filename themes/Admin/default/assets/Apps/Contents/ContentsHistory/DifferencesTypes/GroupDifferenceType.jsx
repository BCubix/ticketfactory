import React from 'react';
import { Component } from '@/AdminService/Component';
import { RenderModifiedFields } from '../DisplayContentDifferences';

export const GroupDifferenceType = ({ actualVersion, previousVersion, nextVersion, type, index, displayGroupHeader = true, ...props }) => {
    if (!displayGroupHeader) {
        return <RenderModifiedFields actualVersion={actualVersion} previousVersion={previousVersion} nextVersion={nextVersion} contentType={type.parameters.fields} {...props} />;
    }

    return (
        <Component.CmtFormBlock title={type.title}>
            <RenderModifiedFields actualVersion={actualVersion} previousVersion={previousVersion} nextVersion={nextVersion} contentType={type.parameters.fields} {...props} />
        </Component.CmtFormBlock>
    );
};
