import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';

import { Constant } from "@/AdminService/Constant";

import {
    intitializeParamsDropzone
} from "@Apps/Parameters/ParametersForm/ParametersTypesModules/utils/initParamsDropzone";

import { loginFailure } from '@Redux/profile/profileSlice';

const TYPE = 'upload';

const getType = () => {
    return TYPE;
};

const getComponent = ({
    paramName,
    paramKey,
    paramValue,
    paramBreakpoints,
    setFieldValue,
    indexTab,
    indexBlock,
    indexParam,
    validations,
    id,
}) => {
    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        setFieldValue(
            `tabs[${indexTab}].blocks[${indexBlock}].parameters[${indexParam}].paramValue`,
            e.filename
        );
    };

    useEffect(() => {
        const fileType = validations?.find((el) => el.name === 'type')?.value;
        const maxWeight = validations?.find((el) => el.name === 'maxWeight')?.value;

        intitializeParamsDropzone({
            logFail: (error) => dispatch(loginFailure({ error: error })),
            onSuccess: handleSubmit,
            dropzoneId: `js-dropzone-${paramName}`,
            id: id,
            fileType,
            maxWeight,
        });
    }, []);

    return (
        <Grid item {...paramBreakpoints} display="flex" alignItems="center">
            {paramValue && (
                <Box
                    component="img"
                    src={`${Constant.PARAMETER_FILE_BASE_URL}/${paramValue}`}
                    height={100}
                    marginRight={4}
                />
            )}
            <Box
                id={`js-dropzone-${paramName}`}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mt: 1,
                    mb: 3,
                    padding: 8,
                    minHeight: 100,
                    borderRadius: 1,
                    border: '2px dashed #BBB',
                    cursor: 'pointer',
                    width: '100%',
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
