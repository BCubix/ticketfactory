import React from 'react';
import { Box } from '@mui/material';
import { PageBlocksDifferences } from './PageBlocksDifferences';
import { TextDifferenceType } from './DifferencesTypes/TextDifferenceType';

export const DisplayPageDifferences = ({ ...rest }) => {
    return (
        <Box>
            <TextDifferenceType name="title" label="Titre" {...rest} />
            <TextDifferenceType name="subtitle" label="Sous-titre" {...rest} />
            <TextDifferenceType name="slug" label="Slug" {...rest} />
            <TextDifferenceType name="keyword" label="Mot-clé" {...rest} />

            <PageBlocksDifferences {...rest} />
        </Box>
    );
};
