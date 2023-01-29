import React, { useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import { useDispatch } from "react-redux";

import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { Box, FormHelperText, FormLabel } from "@mui/material";

import { Api } from "@/AdminService/Api";
import { Component } from "@/AdminService/Component";
import { Constant } from "@/AdminService/Constant";

import { apiMiddleware } from "@Services/utils/apiMiddleware";
import { getMediaType } from "@Services/utils/getMediaType";

export const CmtImageField = ({ label, required = false, name, id = name?.replaceAll('.', '-'), image, setFieldValue, touched, errors, width = null, height = null }) => {
    const dispatch = useDispatch();
    const [openModal, setOpenModal] = useState(false);
    const [imagesList, setImagesList] = useState(null);

    useEffect(() => {
        getImages();
    }, []);

    const getImages = async () => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.mediasApi.getAllMedias();
            if (!result?.result) {
                NotificationManager.error('Une erreur est survenue, essayez de rafraichir la page.', 'Erreur', Constant.REDIRECTION_TIME);
            }

            const images = result?.medias?.filter((el) => getMediaType(el.documentType) === 'image') || [];
            setImagesList(images);
        });
    };

    return (
        <>
            <FormLabel id={`${id}-label`} sx={{ fontSize: '12px' }} required={required}>
                {label}
            </FormLabel>
            <Component.CmtImageCard width={width} height={height} onClick={() => setOpenModal(true)}>
                {image ? (
                    <Component.CmtDisplayMediaType media={image} width={'100%'} height={'auto'} />
                ) : (
                    <Box className="placeholder">
                        <AddCircleOutlineOutlinedIcon />
                    </Box>
                )}
            </Component.CmtImageCard>
            {touched && errors && (
                <FormHelperText error id={`${id}-helper-text`}>
                    {errors}
                </FormHelperText>
            )}
            <Component.CmtMediaModal
                title={`Selectionner l'image`}
                open={openModal}
                onClose={() => setOpenModal(false)}
                mediasList={imagesList}
                media={image}
                setFieldValue={setFieldValue}
                name={name}
                onAddNewMedia={getImages}
            />
        </>
    );
};