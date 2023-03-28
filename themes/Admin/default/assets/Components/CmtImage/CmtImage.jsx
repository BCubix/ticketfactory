import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';

import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { Box, FormHelperText, FormLabel } from '@mui/material';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { getMediaType } from '@Services/utils/getMediaType';

export const CmtImage = ({ label, required = false, id, name, image, setFieldValue, touched, errors, width = null, height = null }) => {
    const dispatch = useDispatch();
    const [openModal, setOpenModal] = useState(false);
    const [imagesList, setImagesList] = useState(null);
    const [imageMediasTotal, setImageMediasTotal] = useState(null);
    const [mediaCategoriesList, setMediaCategoriesList] = useState(null);
    const [mediaFilters, setMediaFilters] = useState({
        title: '',
        active: null,
        iframe: null,
        sort: 'id DESC',
        page: 1,
        limit: 20,
        type: '',
        category: '',
    });

    useEffect(() => {
        getImages();
    }, [mediaFilters]);

    const getImages = async () => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.mediasApi.getMediasList(mediaFilters);
            if (!result?.result) {
                NotificationManager.error('Une erreur est survenue, essayez de rafraichir la page.', 'Erreur', Constant.REDIRECTION_TIME);
            }

            setImagesList(result?.medias);
            setImageMediasTotal(result.total);
        });
    };

    useEffect(() => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.mediaCategoriesApi.getAllMediaCategories();
            if (!result.result) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
            }

            setMediaCategoriesList(result.mediaCategories);
        });
    }, []);

    return (
        <>
            <FormLabel id={`${id}-label`} sx={{ fontSize: '12px' }} required={required}>
                {label}
            </FormLabel>
            <Component.CmtImageCard width={width} height={height} onClick={() => setOpenModal(true)}>
                {image?.id && image?.documentUrl ? (
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
                mediaFilters={mediaFilters}
                setMediaFilters={setMediaFilters}
                total={imageMediasTotal}
                categoriesList={mediaCategoriesList}
            />
        </>
    );
};
