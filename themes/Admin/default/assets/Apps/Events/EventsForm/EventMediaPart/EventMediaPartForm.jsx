import React, { useEffect, useMemo, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

import { apiMiddleware } from '@Services/utils/apiMiddleware';

const filterInit = {
    title: '',
    active: null,
    iframe: null,
    type: '',
    category: '',
    sort: 'id DESC',
    page: 1,
    limit: 20,
};

export const EventMediaPartForm = ({ values, handleChange, touched, errors, setFieldValue, name = 'eventMedias', mediaCategoriesList }) => {
    const dispatch = useDispatch();
    const [openAddModal, setOpenAddModal] = useState(null);
    const [editDialog, setEditDialog] = useState(null);

    const [imageMedias, setImageMedias] = useState(null);
    const [imageMediasTotal, setImageMediasTotal] = useState(null);
    const [imageMediaFilters, setImageMediaFilters] = useState(filterInit);

    const [otherMedias, setOtherMedias] = useState(null);
    const [otherMediasTotal, setOtherMediasTotal] = useState(null);
    const [otherMediaFilters, setOtherMediaFilters] = useState(filterInit);

    const getImageMedias = () => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.mediasApi.getMediasList({ ...imageMediaFilters, type: ['Image'] });
            if (!result?.result) {
                NotificationManager.error('Une erreur est survenue, essayez de rafraichir la page.', 'Erreur', Constant.REDIRECTION_TIME);
                return;
            }
            setImageMedias(result?.medias);
            setImageMediasTotal(result.total);
        });
    };

    const getOtherMedias = () => {
        apiMiddleware(dispatch, async () => {
            Api.mediasApi.getMediasList({ ...otherMediaFilters, type: ['Audio', 'Vidéo', 'PDF'] }).then((result) => {
                if (!result?.result) {
                    NotificationManager.error('Une erreur est survenue, essayez de rafraichir la page.', 'Erreur', Constant.REDIRECTION_TIME);
                    return;
                }
                setOtherMedias(result?.medias);
                setOtherMediasTotal(result.total);
            });
        });
    };

    useEffect(() => {
        getImageMedias();
    }, [imageMediaFilters]);

    useEffect(() => {
        getOtherMedias();
    }, [otherMediaFilters]);

    const changeImageInformations = (newValues) => {
        if (!editDialog) {
            return false;
        }

        return apiMiddleware(dispatch, async () => {
            const newObject = { ...editDialog.item, ...newValues };
            let result = null;

            if (newObject.iframe) {
                result = await Api.mediasApi.editIframeMedia(newObject?.id, newObject);
            } else {
                result = await Api.mediasApi.editMedia(newObject?.id, newObject);
            }

            if (!result?.result) {
                return false;
            }

            setEditDialog({ index: editDialog.index, item: result.media });

            getImageMedias();
            getOtherMedias();

            const fIndex = values?.eventMedias?.findIndex((el) => el.media.id === result.media.id);
            if (fIndex > -1) {
                setFieldValue(`eventMedias.${fIndex}.media`, { ...result.media });
            }

            return true;
        });
    };

    return (
        <>
            <Component.DisplayEventMediaElement
                title="Photos"
                openAddModal={setOpenAddModal}
                mediaType="Image"
                openEditModal={setEditDialog}
                values={values}
                name={name}
                setFieldValue={setFieldValue}
                id="imageMediasEvent"
                error={touched.eventMedias && errors.eventMedias}
            />

            <Component.DisplayEventMediaElement
                title="Autres contenus"
                openAddModal={setOpenAddModal}
                mediaType="Other"
                openEditModal={setEditDialog}
                values={values}
                name={name}
                setFieldValue={setFieldValue}
                id="othersMediasEvent"
            />

            <Component.CmtMediaModal
                title={`Ajouter des éléments média au spectacle`}
                open={Boolean(openAddModal)}
                onClose={() => setOpenAddModal(null)}
                mediasList={openAddModal === 'Image' ? imageMedias : otherMedias}
                media={values.eventMedias}
                setFieldValue={setFieldValue}
                name={name}
                onAddNewMedia={openAddModal === 'Image' ? getImageMedias : getOtherMedias}
                onClick={(selectedMedia) => {
                    let newValue = values.eventMedias;

                    if (newValue.map((el) => el.id).includes(selectedMedia?.id)) {
                        newValue = newValue.filter((el) => el.id !== selectedMedia?.id);
                    } else {
                        newValue.push({ id: selectedMedia?.id, mainImg: false, mainImgCalendar: false, position: '', media: selectedMedia });
                    }

                    setFieldValue(name, newValue);
                }}
                AddMediaLabel="Ajouter"
                RemoveMediaLabel="Retirer"
                mediaFilters={openAddModal === 'Image' ? imageMediaFilters : otherMediaFilters}
                setMediaFilters={openAddModal === 'Image' ? setImageMediaFilters : setOtherMediaFilters}
                total={openAddModal === 'Image' ? imageMediasTotal : otherMediasTotal}
                categoriesList={mediaCategoriesList}
            />

            <Component.EditEventMediaModal
                open={Boolean(editDialog)}
                closeModal={() => setEditDialog(null)}
                selectedMedia={editDialog?.item}
                selectedMediaIndex={editDialog?.index}
                values={values}
                handleChange={handleChange}
                errors={errors}
                name={name}
                setFieldValue={setFieldValue}
                changeImageInformations={changeImageInformations}
            />
        </>
    );
};
