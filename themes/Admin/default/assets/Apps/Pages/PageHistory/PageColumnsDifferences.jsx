import React, { useMemo } from 'react';
import { getPropByString } from '@Services/utils/getPropByString';
import { Box, CardContent, InputLabel, Typography } from '@mui/material';
import { Component } from '@/AdminService/Component';
import { Crud } from '@/AdminService/Crud';

export const PageColumnsDifferences = ({ previousVersion, actualVersion, nextVersion, selectedHistory, pageHistory, page, baseName, blockIndex, ...rest }) => {
    const pageBlockColumns = useMemo(() => {
        return getPropByString(actualVersion, baseName) || {};
    });

    const getFieldType = (columnIndex) => {
        return getPropByString(page, `pageBlocks.${blockIndex}.columns.${columnIndex}.type`);
    };

    return Object.keys(pageBlockColumns)?.map((key, index) => {
        if (!Crud?.pages?.history?.historyTypes || !Crud?.pages?.history?.historyTypes[getFieldType(index)]) {
            return (
                <Box key={index}>
                    <Typography>Colonne N°{parseInt(key) + 1}</Typography>
                    <Typography>Le type de champs n'existe pas</Typography>
                </Box>
            );
        }

        let DifferenceComponent = Crud?.pages?.history?.historyTypes[getFieldType(index)];
        return (
            <Component.CmtCard className="margin-bottom-5" key={index}>
                <CardContent>
                    <InputLabel className="margin-bottom-3">Colonne n°{index + 1}</InputLabel>
                    <DifferenceComponent
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
