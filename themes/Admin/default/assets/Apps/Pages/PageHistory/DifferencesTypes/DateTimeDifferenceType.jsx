import React, { useMemo } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer';
import { getPropByString } from '@Services/utils/getPropByString';
import moment from 'moment/moment';

export const DateTimeDifferenceType = ({ previousVersion, actualVersion, nextVersion, selectedHistory, name, label = '' }) => {
    const previousVersionValue = useMemo(() => {
        if (previousVersion && getPropByString(previousVersion, name) !== undefined) {
            let value = getPropByString(previousVersion, name);

            return value ? moment(value).format('DD/MM/YYYY HH:mm') : '';
        }

        return undefined;
    }, [selectedHistory]);

    const actualVersionValue = useMemo(() => {
        if (actualVersion && getPropByString(actualVersion, name) !== undefined) {
            let value = getPropByString(actualVersion, name);

            return value ? moment(value).format('DD/MM/YYYY HH:mm') : '';
        }

        return undefined;
    }, [selectedHistory]);

    const nextVersionValue = useMemo(() => {
        if (nextVersion && getPropByString(nextVersion, name) !== undefined) {
            let value = getPropByString(nextVersion, name);

            return value ? moment(value).format('DD/MM/YYYY HH:mm') : '';
        }

        return undefined;
    }, [selectedHistory]);

    const displayDifferences = useMemo(() => {
        const isDifferentFromPrevious = previousVersionValue !== undefined && previousVersionValue !== actualVersionValue;
        const isDifferentFromNext = nextVersionValue !== undefined && nextVersionValue !== actualVersionValue;

        return {
            isDifferentFromPrevious,
            isDifferentFromNext,
        };
    }, [selectedHistory]);

    if (actualVersionValue === undefined) {
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
