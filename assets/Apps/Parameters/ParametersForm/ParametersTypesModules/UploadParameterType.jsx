import { Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loginFailure } from '../../../../redux/profile/profileSlice';
import { intitializeParamsDropzone } from './utils/initParamsDropzone';

const TYPE = 'upload';

const getType = () => {
    return TYPE;
};

const getComponent = ({
    paramName,
    paramKey,
    paramValue,
    paramAvailableValue,
    paramBreakpoints,
    setFieldValue,
    indexTab,
    indexBlock,
    indexParam,
    id,
}) => {
    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        console.log(e);
    };

    useEffect(() => {
        intitializeParamsDropzone({
            logFail: (error) => dispatch(loginFailure({ error: error })),
            onSuccess: handleSubmit,
            dropzoneId: `js-dropzone-${paramName}`,
            id: id,
        });
    }, []);

    return (
        <Grid item {...paramBreakpoints}>
            <Box
                id={`js-dropzone-${paramName}`}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mt: 1,
                    mb: 3,
                    padding: 8,
                    minHeight: 120,
                    borderRadius: 1,
                    border: '2px dashed #BBB',
                    cursor: 'pointer',
                }}
            >
                <Typography component="span" className="js-dropzone-label dropzone-element_label">
                    Veuillez déposer un fichier ou cliquer sur la zone
                </Typography>
            </Box>
        </Grid>
    );
};

export default {
    getType,
    getComponent,
};
