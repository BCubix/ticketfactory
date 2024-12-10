import React from 'react';
import { Box, Grid, Typography, Paper } from '@mui/material';
import DiffViewer from './VersionDiffViewer';

const VersionComparer = ({ previous, current, next }) => {
    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h4" gutterBottom>
                Comparaison des versions
            </Typography>
            <Grid container spacing={2}>
                {/* Colonne : Version précédente */}
                <Grid item xs={4}>
                    <Paper elevation={3} sx={{ p: 2, backgroundColor: '#d8eaff' }}>
                        <Typography variant="h6">Version précédente</Typography>
                        {previous ? <DiffViewer changes={previous} /> : <Typography variant="body2">Aucune version précédente.</Typography>}
                    </Paper>
                </Grid>

                {/* Colonne : Version actuelle */}
                <Grid item xs={4}>
                    <Paper elevation={3} sx={{ p: 2, backgroundColor: '#ffffff' }}>
                        <Typography variant="h6">Version actuelle</Typography>
                        {current ? <DiffViewer changes={current} /> : <Typography variant="body2">Aucune version actuelle.</Typography>}
                    </Paper>
                </Grid>

                {/* Colonne : Version suivante */}
                <Grid item xs={4}>
                    <Paper elevation={3} sx={{ p: 2, backgroundColor: '#d8ffd8' }}>
                        <Typography variant="h6">Version suivante</Typography>
                        {next ? <DiffViewer changes={next} /> : <Typography variant="body2">Aucune version suivante.</Typography>}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default VersionComparer;
