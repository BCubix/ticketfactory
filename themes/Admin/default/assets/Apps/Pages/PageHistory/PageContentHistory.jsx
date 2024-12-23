import React from 'react';
import { getPropByString } from '@Services/utils/getPropByString';
import { Crud } from '@/AdminService/Crud';

export const PageContentDifferences = ({ previousVersion, actualVersion, nextVersion, selectedHistory, pageHistory, page, baseName, ...rest }) => {
    let pageBlockType = getPropByString(page, baseName + 'pageBlockType');
    if (!pageBlockType) {
        return <></>;
    }

    return (
        <RenderModifiedFields
            previousVersion={getPropByString(previousVersion, baseName + 'fields')}
            nextVersion={getPropByString(nextVersion, baseName + 'fields')}
            actualVersion={getPropByString(actualVersion, baseName + 'fields')}
            blockType={pageBlockType.fields}
            basePreviousVersion={previousVersion}
            baseAcualVersion={actualVersion}
            baseNextVersion={nextVersion}
        />
    );
};

export const RenderModifiedFields = ({ actualVersion, blockType, previousVersion, nextVersion, ...props }) => {
    if (!actualVersion || !blockType) return null;

    return Object.entries(actualVersion).map(([key, value]) => {
        const fieldDef = blockType.find((field) => field.name === key);
        const FieldComponent = fieldDef ? Crud?.pages?.history?.historyTypes[fieldDef.type] : null;

        if (!FieldComponent) {
            return (
                <div key={key}>
                    <strong>Champ inconnu ({key}) :</strong> {JSON.stringify(value)}
                </div>
            );
        }

        return (
            <FieldComponent
                key={key}
                index={key}
                type={fieldDef}
                actualVersion={value}
                previousVersion={previousVersion ? previousVersion[key] || null : null}
                nextVersion={nextVersion ? nextVersion[key] || null : null}
                {...props}
                label={fieldDef.title}
            />
        );
    });
};
