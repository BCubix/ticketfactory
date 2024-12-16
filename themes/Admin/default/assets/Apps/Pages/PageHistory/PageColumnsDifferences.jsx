import React, { useMemo } from 'react';
import { getPropByString } from '@Services/utils/getPropByString';
import { CardContent, InputLabel } from '@mui/material';
import { TextDifferenceType } from './DifferencesTypes/TextDifferenceType';
import { Component } from '@/AdminService/Component';

export const PageColumnsDifferences = ({ previousVersion, actualVersion, nextVersion, selectedHistory, pageHistory, page, baseName, ...rest }) => {
    const pageBlockColumns = useMemo(() => {
        return getPropByString(actualVersion, baseName) || {};
    });

    console.log(actualVersion, baseName + 'columns', pageBlockColumns);

    return Object.keys(pageBlockColumns)?.map((key, index) => {
        return (
            <Component.CmtCard className="margin-bottom-5">
                <CardContent>
                    <InputLabel className="margin-bottom-3">Colonne n°{index + 1}</InputLabel>
                    <TextDifferenceType
                        previousVersion={previousVersion}
                        actualVersion={actualVersion}
                        nextVersion={nextVersion}
                        selectedHistory={selectedHistory}
                        pageHistory={pageHistory}
                        page={page}
                        name={`${baseName}.${key}.content`}
                        label="Contenu"
                        {...rest}
                    />
                </CardContent>
            </Component.CmtCard>
        );
    });
};

/* if (getPropByString(actualVersion, baseName + key)?.type) {
    return (
        <Box key={index}>
        <Typography>Colonne N°{key + 1}</Typography>
        <Typography>Le type de champs à été modifié</Typography>
        </Box>
    );
} */
