import React, { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Typography } from '@mui/material';
import { Component } from '@/AdminService/Component';
import { intitializeDropzone } from '@Apps/Medias/services/utils/dropzone';
import { loginFailure } from '@Apps/Auth/redux/profile/profileSlice';
import { parametersSelector } from '@Apps/Parameters/redux/parameters/parametersSlice';
import { useSelector } from 'react-redux';

export const CreateMedia = ({ handleSubmit }) => {
    const dispatch = useDispatch();
    const [imageCounter, setImageCounter] = useState(0);
    const { parameters } = useSelector(parametersSelector);
    var countImage = useRef(0);
    var imageArray = [];

    const createUploadImageArray = (image) => {
        imageArray.push(image);
        countImage.current -= 1;
        if (countImage.current === 0) handleSubmit(imageArray);
    };

    useEffect(() => {
        let maxImageSize = parameters?.find((it) => it.paramKey === 'core_max_images_size')?.paramValue;
        let maxFileSize = parameters?.find((it) => it.paramKey === 'core_max_files_size')?.paramValue;

        maxImageSize = maxImageSize ? maxImageSize : maxImageSize === 0 ? 0 : null;
        maxFileSize = maxFileSize ? maxFileSize : maxFileSize === 0 ? 0 : null;

        intitializeDropzone({
            logFail: (error) => dispatch(loginFailure({ error: error })),
            onSuccess: handleSubmit,
            createUploadImageArray: createUploadImageArray,
            setImageCounter: setImageCounter,
            maxFileSize,
            maxImageSize,
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
