import React, {useEffect} from 'react';
import { useDispatch } from "react-redux";

import { Typography } from "@mui/material";

import { Component } from "@/AdminService/Component";

import { intitializeDropzone } from "@Apps/Modules/UploadModule/utils/dropzone";

import { loginFailure } from "@Redux/profile/profileSlice";

export const UploadModule = ({ handleSubmit, handleAdded, handleFail }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        intitializeDropzone({
            logFail: (error) => dispatch(loginFailure({ error: error })),
            onSuccess: handleSubmit,
            onAdded: handleAdded,
            onFail: handleFail,
        });
    }, []);

    return (
        <Component.DropzoneWrapper id="dropzone" className="js-dropzone dropzone-element">
            <Typography component="span" className="js-dropzone-label dropzone-element_label">
                Veuillez déposer un zip ou cliquer sur la zone
            </Typography>
        </Component.DropzoneWrapper>
    );
}
