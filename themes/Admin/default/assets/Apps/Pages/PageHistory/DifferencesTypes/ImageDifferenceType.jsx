import React, { useMemo } from 'react';
import { Box, Grid, Typography } from '@mui/material';

import { getPropByString } from '@Services/utils/getPropByString';

export const ImageDifferenceType = ({ previousVersion, actualVersion, nextVersion, selectedHistory, pageHistory, page, name, label = '' }) => {
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
                {Boolean(previousVersion) && (
                    <Grid item xs={4}>
                        {displayDifferences.isDifferentFromPrevious && (
                            <Box className="history_diff_display_old history_img_wrapper">
                                <Box className="history_img_container">
                                    <Box component="img" className="history_img" src={previousVersionValue?.documentUrl} />
                                    <Box className="history_img_name_wrapper">
                                        <Typography className="history_img_name" component="pre">
                                            {previousVersionValue?.title}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        )}
                    </Grid>
                )}

                <Grid item xs={Boolean(previousVersion) ? 4 : 6}>
                    <Box className="history_diff_actual history_img_wrapper">
                        <Box className="history_img_container ">
                            <Box component="img" className="history_img" src={actualVersionValue?.documentUrl} />
                            <Box className="history_img_name_wrapper">
                                <Typography className="history_img_name" component="pre">
                                    {actualVersionValue?.title}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Grid>

                <Grid item xs={Boolean(previousVersion) ? 4 : 6}>
                    {displayDifferences.isDifferentFromNext && (
                        <Box className="history_diff_display_new history_img_wrapper">
                            <Box className="history_img_container">
                                <Box component="img" className="history_img" src={nextVersionValue?.documentUrl} />
                                <Box className="history_img_name_wrapper">
                                    <Typography className="history_img_name" component="pre">
                                        {nextVersionValue?.title}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
};
