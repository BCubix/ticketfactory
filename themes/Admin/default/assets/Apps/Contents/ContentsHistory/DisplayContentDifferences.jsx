import React from 'react';
import { Box } from '@mui/material';
import { TextDifferenceType } from './DifferencesTypes/TextDifferenceType';
import { getPropByString } from '@Services/utils/getPropByString';
import { Crud } from '@/AdminService/Crud';
import { Component } from '@/AdminService/Component';

export const DisplayContentDifferences = ({ previousVersion, actualVersion, nextVersion, selectedHistory, contentHistory, content, baseName, ...rest }) => {
    return (
        <Box>
            <TextDifferenceType name="title" label="Titre" previousVersion={previousVersion} actualVersion={actualVersion} nextVersion={nextVersion} {...rest} />
            <TextDifferenceType name="slug" label="Slug" {...rest} />

            <Component.CmtFormBlock title={'Formulaire'}>
                <RenderModifiedFields
                    previousVersion={getPropByString(previousVersion, 'fields')}
                    nextVersion={getPropByString(nextVersion, 'fields')}
                    actualVersion={getPropByString(actualVersion, 'fields')}
                    contentType={content?.contentType?.fields}
                    basePreviousVersion={previousVersion}
                    baseActualVersion={actualVersion}
                    baseNextVersion={nextVersion}
                />
            </Component.CmtFormBlock>
        </Box>
    );
};

export const RenderModifiedFields = ({ actualVersion, contentType, previousVersion, nextVersion, ...props }) => {
    if (!actualVersion || !contentType) return null;

    return Object.entries(actualVersion).map(([key, value]) => {
        const fieldDef = contentType.find((field) => field.name === key);
        const FieldComponent = fieldDef ? Crud?.contents?.history?.historyTypes[fieldDef.type] : null;

        if (!FieldComponent) {
            return (
                <div key={key}>
                    <strong>Champ inconnu ({key}) :</strong> {JSON.stringify(value)}
                </div>
            );
        }

        return (
            <FieldComponent
                {...props}
                key={key}
                index={key}
                type={fieldDef}
                actualVersion={value}
                previousVersion={previousVersion ? previousVersion[key] || null : null}
                nextVersion={nextVersion ? nextVersion[key] || null : null}
                label={fieldDef.title}
            />
        );
    });
};
