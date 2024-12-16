import React, { useMemo } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import ReactDiffViewer from 'react-diff-viewer';
import { getNextFieldValue } from '../../services/utils/getNextFieldValue';
import { getPropByString } from '@Services/utils/getPropByString';

export const TextDifferenceType = ({ previousVersion, actualVersion, nextVersion, selectedHistory, pageHistory, page, name, label = '' }) => {
    const actualVersionValue = useMemo(() => {
        if (actualVersion && getPropByString(actualVersion, name) !== undefined) {
            return getPropByString(actualVersion, name);
        }

        let value = getNextFieldValue(pageHistory, selectedHistory, name);

        if (value === undefined && page && getPropByString(page, name) !== undefined) {
            return getPropByString(page, name);
        }

        return value;
    }, [selectedHistory]);

    const displayDifferences = useMemo(() => {
        const isDifferentFromPrevious = previousVersion && getPropByString(previousVersion, name) !== undefined && getPropByString(previousVersion, name) !== actualVersionValue;
        const isDifferentFromNext = nextVersion && getPropByString(nextVersion, name) !== undefined && getPropByString(nextVersion, name) !== actualVersionValue;

        return {
            isDifferentFromPrevious,
            isDifferentFromNext,
            hasDifferences: isDifferentFromPrevious || isDifferentFromNext,
        };
    }, [selectedHistory]);

    if (!displayDifferences.hasDifferences) {
        return <></>;
    }

    return (
        <Box className="margin-bottom-5">
            {label !== '' && (
                <Typography variant="h3" className="history_diff_title">
                    {label}
                </Typography>
            )}
            <Grid container spacing={4}>
                {Boolean(previousVersion) && (
                    <Grid item xs={4}>
                        {displayDifferences.isDifferentFromPrevious && (
                            <Box className="history_diff_display_old">
                                <Typography component="pre">{getPropByString(previousVersion, name)}</Typography>
                            </Box>
                        )}
                    </Grid>
                )}

                <Grid item xs={Boolean(previousVersion) ? 4 : 6}>
                    {displayDifferences.isDifferentFromNext && (
                        <Box className="history_diff_new">
                            <ReactDiffViewer
                                oldValue={actualVersionValue || ''}
                                newValue={getPropByString(nextVersion, name) || ''}
                                splitView={false}
                                hideLineNumbers={true}
                                styles={{
                                    variables: {
                                        light: {
                                            removedBackground: '#e6ffe6', // Fond vert clair pour la différence suivante
                                            removedColor: '#006400', // Texte vert foncé
                                            diffViewerBackground: '#ffffff', // Fond global
                                        },
                                    },
                                    line: {
                                        marker: { display: 'none' },
                                    },
                                }}
                            />
                        </Box>
                    )}

                    <Box className="history_diff_actual">
                        <Typography component="pre" style={{ margin: 0 }}>
                            {actualVersionValue}
                        </Typography>
                    </Box>

                    {displayDifferences.isDifferentFromPrevious && (
                        <Box className="history_diff_old">
                            <ReactDiffViewer
                                oldValue={getPropByString(previousVersion, name) || ''}
                                newValue={actualVersionValue || ''}
                                splitView={false}
                                showDiffOnly={false}
                                styles={{
                                    variables: {
                                        light: {
                                            removedBackground: '#cce7ff',
                                            removedColor: '#003366',
                                            diffViewerBackground: '#ffffff',
                                        },
                                    },
                                    line: {
                                        marker: { display: 'none' },
                                    },
                                }}
                            />
                        </Box>
                    )}
                </Grid>

                <Grid item xs={Boolean(previousVersion) ? 4 : 6}>
                    {displayDifferences.isDifferentFromNext && (
                        <Box className="history_diff_display_new">
                            <Typography component="pre">{nextVersion && getPropByString(nextVersion, name)}</Typography>
                        </Box>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
};
