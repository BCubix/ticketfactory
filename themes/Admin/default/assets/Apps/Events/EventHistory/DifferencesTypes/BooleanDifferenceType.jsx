import React, { useMemo } from 'react';
import { Box, Grid, Typography } from '@mui/material';

import { getPropByString } from '@Services/utils/getPropByString';

export const BooleanDifferenceType = ({
    previousVersion,
    actualVersion,
    nextVersion,
    basePreviousVersion,
    selectedHistory,
    name,
    label = '',
    trueLabel = 'Activé',
    falseLabel = 'Désactivé',
}) => {
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
        const isDifferentFromPrevious = previousVersionValue !== undefined && previousVersionValue?.id !== actualVersionValue?.id;
        const isDifferentFromNext = nextVersionValue !== undefined && nextVersionValue?.id !== actualVersionValue?.id;

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
                {(Boolean(previousVersion) || Boolean(basePreviousVersion)) && (
                    <Grid item xs={4}>
                        {displayDifferences.isDifferentFromPrevious && (
                            <Box className="history_diff_display_old">
                                <Typography component="pre" style={{ margin: 0 }}>
                                    {previousVersionValue ? trueLabel : falseLabel}
                                </Typography>
                            </Box>
                        )}
                    </Grid>
                )}

                <Grid item xs={Boolean(previousVersion) || Boolean(basePreviousVersion) ? 4 : 6}>
                    <Box className="history_diff_actual">
                        <Typography component="pre" style={{ margin: 0 }}>
                            {actualVersionValue ? trueLabel : falseLabel}
                        </Typography>
                    </Box>
                </Grid>

                <Grid item xs={Boolean(previousVersion) || Boolean(basePreviousVersion) ? 4 : 6}>
                    {displayDifferences.isDifferentFromNext && (
                        <Box className="history_diff_display_new">
                            <Typography component="pre" style={{ margin: 0 }}>
                                {nextVersionValue ? trueLabel : falseLabel}
                            </Typography>
                        </Box>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
};
