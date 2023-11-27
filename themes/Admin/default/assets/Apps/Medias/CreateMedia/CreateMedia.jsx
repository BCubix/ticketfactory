import React, { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Typography } from '@mui/material';
import { Component } from '@/AdminService/Component';
import { intitializeDropzone } from '@Apps/Medias/services/utils/dropzone';
import { loginFailure } from '@Apps/Auth/redux/profile/profileSlice';

export const CreateMedia = ({ handleSubmit }) => {
    const dispatch = useDispatch();
    const [imageCounter, setImageCounter] = useState(0);
    var countImage = useRef(0);
    var imageArray = [];

    const createUploadImageArray = (image) => {
        imageArray.push(image);
        countImage.current -= 1;
        if (countImage.current === 0) handleSubmit(imageArray);
    };
    useEffect(() => {
        intitializeDropzone({
            logFail: (error) => dispatch(loginFailure({ error: error })),
            onSuccess: handleSubmit,
            createUploadImageArray: createUploadImageArray,
            setImageCounter: setImageCounter,
        });
    }, []);
    useEffect(() => {
        countImage.current = imageCounter;
    }, [imageCounter]);

    return (
        <Component.DropzoneWrapper id="dropzone" className="js-dropzone dropzone-element">
            <Typography component="span" className="js-dropzone-label dropzone-element_label">
                Veuillez déposer un fichier ou cliquer sur la zone
            </Typography>
        </Component.DropzoneWrapper>
    );
};
