import React from 'react';
import { Box, CardContent, InputLabel, Typography } from '@mui/material';
import { TextDifferenceType } from './DifferencesTypes/TextDifferenceType';
import { Component } from '@/AdminService/Component';
import { PageColumnsDifferences } from './PageColumnsDifferences';
import { PageContentDifferences } from './PageContentHistory';
import { checkPageBlockIndexTypeChange } from '../services/utils/checkTypes';

export const PageBlocksDifferences = ({ previousVersion, actualVersion, nextVersion, selectedHistory, pageHistory, page, ...rest }) => {
    if (!('pageBlocks' in actualVersion)) {
        return <></>;
    }

    return (
        <Box>
            <Typography variant="h3" className="history_diff_title margin-bottom-3">
                Blocs
            </Typography>

            {Object.entries(actualVersion.pageBlocks).map(([key, value], index) => {
                if (checkPageBlockIndexTypeChange(pageHistory, selectedHistory, index)) {
                    return (
                        <Component.CmtCard key={index} className="margin-bottom-5">
                            <CardContent>
                                <Box key={index}>
                                    <Typography>Bloc N°{parseInt(index) + 1}</Typography>
                                    <Typography>Le type de bloc à été modifié</Typography>
                                </Box>
                            </CardContent>
                        </Component.CmtCard>
                    );
                }

                return (
                    <Component.CmtCard key={index} className="margin-bottom-5">
                        <CardContent>
                            <InputLabel className="margin-bottom-3">Bloc n°{index + 1}</InputLabel>

                            <Box>
                                <TextDifferenceType
                                    previousVersion={previousVersion}
                                    actualVersion={actualVersion}
                                    nextVersion={nextVersion}
                                    selectedHistory={selectedHistory}
                                    pageHistory={pageHistory}
                                    page={page}
                                    name={`pageBlocks.${key}.name`}
                                    label="Nom du bloc"
                                    {...rest}
                                />

                                <TextDifferenceType
                                    previousVersion={previousVersion}
                                    actualVersion={actualVersion}
                                    nextVersion={nextVersion}
                                    selectedHistory={selectedHistory}
                                    pageHistory={pageHistory}
                                    page={page}
                                    name={`pageBlocks.${key}.class`}
                                    label="Classe"
                                    {...rest}
                                />

                                <PageColumnsDifferences
                                    previousVersion={previousVersion}
                                    actualVersion={actualVersion}
                                    nextVersion={nextVersion}
                                    selectedHistory={selectedHistory}
                                    pageHistory={pageHistory}
                                    page={page}
                                    baseName={`pageBlocks.${key}.columns.`}
                                    blockIndex={index}
                                    {...rest}
                                />

                                <PageContentDifferences
                                    previousVersion={previousVersion}
                                    actualVersion={actualVersion}
                                    nextVersion={nextVersion}
                                    selectedHistory={selectedHistory}
                                    pageHistory={pageHistory}
                                    page={page}
                                    baseName={`pageBlocks.${key}.`}
                                    blockIndex={index}
                                    {...rest}
                                />
                            </Box>
                        </CardContent>
                    </Component.CmtCard>
                );
            })}
        </Box>
    );
};
