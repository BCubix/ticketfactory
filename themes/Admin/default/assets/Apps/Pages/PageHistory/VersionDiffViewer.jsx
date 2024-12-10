import React from 'react';
import { Box, Grid, Typography, Paper } from '@mui/material';
import HighlightedText from './HighlightedText';

const VersionDiffViewer = ({ version }) => {
    if (!version || !version.differences) {
        return <Typography variant="body1">Aucune différence détectée.</Typography>;
    }

    const { fields } = version;

    return (
        <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>
                Comparaison des champs
            </Typography>
            {Object.keys(fields).map((field) => {
                const { before, after } = fields[field];

                return (
                    <Box key={field} sx={{ mb: 2 }}>
                        <Typography variant="h6" color="primary">
                            {field}
                        </Typography>
                        <Grid container spacing={2}>
                            {/* Valeur avant */}
                            <Grid item xs={6}>
                                <Typography variant="subtitle1" color="text.secondary">
                                    Avant :
                                </Typography>
                                <HighlightedText text={before} color="blue" />
                            </Grid>

                            {/* Valeur après */}
                            <Grid item xs={6}>
                                <Typography variant="subtitle1" color="text.secondary">
                                    Après :
                                </Typography>
                                <HighlightedText text={after} color="green" />
                            </Grid>
                        </Grid>
                    </Box>
                );
            })}
        </Paper>
    );
};

export default VersionDiffViewer;
