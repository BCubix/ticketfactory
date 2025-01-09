import React from 'react';
import { RenderModifiedFields } from '../PageContentHistory';
import { Component } from '@/AdminService/Component';

export const GroupDifferenceType = ({ actualVersion, previousVersion, nextVersion, type, index, displayGroupHeader = true, ...props }) => {
    if (!displayGroupHeader) {
        return <RenderModifiedFields actualVersion={actualVersion} previousVersion={previousVersion} nextVersion={nextVersion} blockType={type.parameters.fields} {...props} />;
    }

    return (
        <Component.CmtFormBlock title={type.title}>
            <RenderModifiedFields actualVersion={actualVersion} previousVersion={previousVersion} nextVersion={nextVersion} blockType={type.parameters.fields} {...props} />
        </Component.CmtFormBlock>
    );
};
