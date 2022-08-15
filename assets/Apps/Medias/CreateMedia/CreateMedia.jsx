import React, { useEffect } from 'react';
import { DropzoneWrapper } from '../Components/DropzoneWrapper';
import { Typography } from '@mui/material';
import { loginFailure } from '../../../redux/profile/profileSlice';
import { useDispatch } from 'react-redux';
import { intitializeDropzone } from '../utils/dropzone';

export const CreateMedia = ({ handleSubmit }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        intitializeDropzone({
            logFail: (error) => dispatch(loginFailure({ error: error })),
            onSuccess: handleSubmit,
        });
    }, []);

    return (
        <DropzoneWrapper id="dropzone" className="js-dropzone dropzone-element">
            <Typography component="span" className="js-dropzone-label dropzone-element_label">
                Veuillez déposer un fichier ou cliquer sur la zone
            </Typography>
        </DropzoneWrapper>
    );
};
