import React, { useMemo } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer';
import { getNextFieldValue } from '../../services/utils/getNextFieldValue';
import { getPropByString } from '@Services/utils/getPropByString';

export const TextDifferenceType = ({ previousVersion, actualVersion, nextVersion, selectedHistory, pageHistory, page, name, label = '' }) => {
    const previousVersionValue = useMemo(() => {
        if (previousVersion && getPropByString(previousVersion, name) !== undefined) {
            return getPropByString(previousVersion, name);
        }

        return undefined;
    }, [selectedHistory]);

    const actualVersionValue = useMemo(() => {
        if (actualVersion && getPropByString(actualVersion, name) !== undefined) {
            return getPropByString(actualVersion, name);
        }

        return undefined;
    }, [selectedHistory]);

    const nextVersionValue = useMemo(() => {
        if (nextVersion && getPropByString(nextVersion, name) !== undefined) {
            return getPropByString(nextVersion, name);
        }

        return undefined;
    }, [selectedHistory]);

    const displayDifferences = useMemo(() => {
        if (actualVersionValue === undefined) {
            return { hasDifferences: false };
        }

        const isDifferentFromPrevious = previousVersionValue !== undefined && previousVersionValue !== actualVersionValue;
        const isDifferentFromNext = nextVersionValue !== undefined && nextVersionValue !== actualVersionValue;

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
                                <Typography component="pre">{previousVersionValue || ''}</Typography>
                            </Box>
                        )}
                    </Grid>
                )}

                <Grid item xs={Boolean(previousVersion) ? 4 : 6}>
                    {displayDifferences.isDifferentFromNext && (
                        <Box className="history_diff_new">
                            <ReactDiffViewer
                                oldValue={actualVersionValue || ''}
                                newValue={nextVersionValue || ''}
                                splitView={false}
                                hideLineNumbers={true}
                                compareMethod={DiffMethod.WORDS}
                                styles={{
                                    variables: {
                                        light: {
                                            removedBackground: '#e6ffe6',
                                            removedColor: '#006400',
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

                    <Box className="history_diff_actual">
                        <Typography component="pre" style={{ margin: 0 }}>
                            {actualVersionValue}
                        </Typography>
                    </Box>

                    {displayDifferences.isDifferentFromPrevious && (
                        <Box className="history_diff_old">
                            <ReactDiffViewer
                                oldValue={previousVersionValue || ''}
                                newValue={actualVersionValue || ''}
                                splitView={false}
                                showDiffOnly={false}
                                compareMethod={DiffMethod.WORDS}
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
                            <Typography component="pre">{nextVersionValue || ''}</Typography>
                        </Box>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
};
