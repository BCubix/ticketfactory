import React, {useEffect} from 'react';
import { useDispatch } from "react-redux";

import { Component } from "@/AdminService/Component";

import { loginFailure } from "@Redux/profile/profileSlice";

import { intitializeDropzone } from "@Apps/Modules/UploadModule/utils/dropzone";
import { Typography } from "@mui/material";

export const UploadModule = ({ handleSubmit }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        intitializeDropzone({
            logFail: (error) => dispatch(loginFailure({ error: error })),
            onSuccess: handleSubmit,
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
