import React from 'react';
import { Box, Grid, Typography, Divider } from '@mui/material';
import { Component } from '@/AdminService/Component';
import { useTheme } from '@mui/material/styles';

import ErrorIcon from '@mui/icons-material/Error';
import ConstructionIcon from '@mui/icons-material/Construction';
import FactCheckIcon from '@mui/icons-material/FactCheck';

export const HealthStats = ({ healthStats }) => {
    const theme = useTheme();

    return (
        <Grid item xs={12}>
            <Component.CmtCard>
                <Component.CmtCardHeader title="Santé du site" />
                <Box sx={{ padding: '10px' }}>
                    {healthStats.critical.length > 0 && (
                        <Box sx={{ display: 'flex', alignItems: 'center', padding: '10px' }}>
                            <ErrorIcon sx={{ mr: 2, color:theme?.palette?.error?.main }} />
                            <Typography variant="h3" color="text.primary" sx={{ fontWeight: 'bold' }}>
                                {healthStats.critical.length} Erreurs critiques :
                            </Typography>
                        </Box>
                    )}
                    {healthStats.critical.length > 0 && (
                        <ul>
                            {healthStats.critical.map((critique, index) => (
                                <li key={index}>
                                    <Typography variant="body1" color="text.primary" sx={{ padding: "7px" }}>
                                        {critique[0]}
                                    </Typography>
                                </li>
                            ))}
                        </ul>
                    )}
                    {healthStats.critical.length > 0 && <Divider variant="middle" sx={{ my: 2 }} />}

                    {healthStats.improvements.length > 0 && (
                        <Box sx={{ display: 'flex', alignItems: 'center', padding: '10px'}}>
                            <ConstructionIcon sx={{ mr: 2 ,color:theme?.palette?.warning?.main }} />
                            <Typography variant="h3" color="text.primary" sx={{ fontWeight: 450 }}>
                                {healthStats.improvements.length} améliorations recommendations
                            </Typography>
                        </Box>
                    )}
                    {healthStats.improvements.length > 0 && (
                        <ul>
                            {healthStats.improvements.map((improvement, index) => (
                                <li key={index}>
                                    <Typography variant="body1" color="text.primary" sx={{ padding: "7px" }}>
                                        {improvement[0]}
                                    </Typography>
                                </li>
                            ))}
                        </ul>
                    )}
                    {healthStats.improvements.length > 0 && <Divider variant="middle" sx={{ my: 2 }} />}

                    {healthStats.noIssue.length > 0 && (
                        <Box sx={{ display: 'flex', alignItems: 'center', padding: '10px'}}>
                            <FactCheckIcon sx={{ mr: 2, color:theme?.palette?.success?.main }} />
                            <Typography variant="h3" color="text.primary" sx={{ fontWeight: 450 }}>
                                {healthStats.noIssue.length} points sans problème détectés
                            </Typography>
                        </Box>
                    )}
                    {healthStats.noIssue.length > 0 && (
                        <ul>
                            {healthStats.noIssue.map((noIssue, index) => (
                                <li key={index}>
                                    <Typography variant="body1" color="text.primary" sx={{ padding: "7px" }}>
                                        {noIssue[0]}
                                    </Typography>
                                </li>
                            ))}
                        </ul>
                    )}
                </Box>
            </Component.CmtCard>
        </Grid>
    );
};
