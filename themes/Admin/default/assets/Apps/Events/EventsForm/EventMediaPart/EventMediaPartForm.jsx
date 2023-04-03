import React, { useEffect, useMemo, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';

import AddIcon from '@mui/icons-material/Add';
import OpenWithIcon from '@mui/icons-material/OpenWith';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { Box } from '@mui/system';

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

const VIEW_MODE_LIST = {
    DEFAULT: 'default',
    MOVE: 'move',
    DELETE: 'delete',
};

export const EventMediaPartForm = ({ values, handleChange, touched, errors, setFieldValue, name = 'eventMedias', mediaCategoriesList }) => {
    const dispatch = useDispatch();
    const [viewMode, setViewMode] = useState(VIEW_MODE_LIST.DEFAULT);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [editDialog, setEditDialog] = useState(null);

    const [medias, setMedias] = useState(null);
    const [mediasTotal, setMediasTotal] = useState(null);
    const [mediasFilters, setMediasFilters] = useState(filterInit);

    const getMedias = () => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.mediasApi.getMediasList({ ...mediasFilters });
            if (!result?.result) {
                NotificationManager.error('Une erreur est survenue, essayez de rafraichir la page.', 'Erreur', Constant.REDIRECTION_TIME);
                return;
            }
            setMedias(result?.medias);
            setMediasTotal(result.total);
        });
    };

    useEffect(() => {
        getMedias();
    }, [mediasFilters]);

    const updatedMedia = (newValues) => {
        if (editDialog) {
            setEditDialog({ ...editDialog, item: newValues });
        }

        const fIndex = values?.eventMedias?.findIndex((el) => el.media.id === newValues.id);
        if (fIndex > -1) {
            setFieldValue(`eventMedias.${fIndex}.media`, { ...newValues });
        }

        const lIndex = medias?.findIndex((el) => el.id === newValues.id);
        if (lIndex > -1) {
            let newList = medias;
            newList[lIndex] = newValues;
            setMedias(newList);
        }
    };

    const eventMedias = useMemo(() => {
        const eventMediasList = [];

        values?.eventMedias?.forEach((element) => {
            const search = eventMediasList?.findIndex((el) => el.type === element?.media?.realType);
            if (search > -1) {
                eventMediasList[search].eventMedias?.push(element);
            } else {
                eventMediasList.push({ type: element?.media?.realType, eventMedias: [element] });
            }
        });

        return eventMediasList;
    });

    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center', my: 5 }}>
                <Component.AddBlockButton
                    sx={{ marginRight: 3 }}
                    size="small"
                    color="primary"
                    variant="outlined"
                    id="addMediaButton"
                    onClick={() => {
                        setOpenAddModal(true);
                    }}
                    disabled={viewMode !== VIEW_MODE_LIST.DEFAULT}
                >
                    <AddIcon /> Ajouter
                </Component.AddBlockButton>

                <Component.ActionButton
                    sx={{ marginRight: 3, position: 'relative' }}
                    size="small"
                    color="primary"
                    variant="outlined"
                    id="moveMediaButton"
                    onClick={() => {
                        setViewMode(viewMode === VIEW_MODE_LIST.MOVE ? VIEW_MODE_LIST.DEFAULT : VIEW_MODE_LIST.MOVE);
                    }}
                    disabled={viewMode !== VIEW_MODE_LIST.DEFAULT && viewMode !== VIEW_MODE_LIST.MOVE}
                >
                    <OpenWithIcon /> Réorganiser
                    {viewMode === VIEW_MODE_LIST.MOVE && (
                        <CloseIcon color="error" sx={{ height: 20, width: 20, position: 'absolute', top: -10, right: -10, borderRadius: '50%', backgroundColor: '#FFFFFF' }} />
                    )}
                </Component.ActionButton>

                <Component.DeleteButton
                    sx={{ marginRight: 3, position: 'relative' }}
                    size="small"
                    color="error"
                    variant="outlined"
                    id="moveMediaButton"
                    onClick={() => {
                        setViewMode(viewMode === VIEW_MODE_LIST.DELETE ? VIEW_MODE_LIST.DEFAULT : VIEW_MODE_LIST.DELETE);
                    }}
                    disabled={viewMode !== VIEW_MODE_LIST.DEFAULT && viewMode !== VIEW_MODE_LIST.DELETE}
                >
                    <DeleteIcon /> Supprimer
                    {viewMode === VIEW_MODE_LIST.DELETE && (
                        <CloseIcon color="error" sx={{ height: 20, width: 20, position: 'absolute', top: -10, right: -10, borderRadius: '50%', backgroundColor: '#FFFFFF' }} />
                    )}
                </Component.DeleteButton>
            </Box>

            {viewMode === VIEW_MODE_LIST.DEFAULT &&
                eventMedias.map((item, index) => (
                    <Component.DisplayEventMediaElement
                        key={index}
                        title={item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                        openAddModal={setOpenAddModal}
                        mediaType={item.type}
                        openEditModal={setEditDialog}
                        values={values}
                        mediasList={item?.eventMedias}
                        name={name}
                        setFieldValue={setFieldValue}
                        id="eventMedias"
                        error={touched.eventMedias && errors.eventMedias}
                    />
                ))}

            {viewMode === VIEW_MODE_LIST.MOVE && <Component.MoveEventMedias eventMedias={values.eventMedias} setFieldValue={setFieldValue} />}
            {viewMode === VIEW_MODE_LIST.DELETE && <Component.DeleteEventMedias eventMedias={values.eventMedias} setFieldValue={setFieldValue} />}

            <Component.CmtMediaModal
                title={`Ajouter des éléments média au spectacle`}
                open={openAddModal}
                onClose={() => setOpenAddModal(false)}
                mediasList={medias}
                media={values.eventMedias}
                setFieldValue={setFieldValue}
                name={name}
                onAddNewMedia={getMedias}
                onClick={(selectedMedia) => {
                    let newValue = values.eventMedias;

                    if (newValue.map((el) => el.id).includes(selectedMedia?.id)) {
                        newValue = newValue.filter((el) => el.id !== selectedMedia?.id);
                    } else {
                        newValue.push({ id: selectedMedia?.id, mainImg: false, mainImgCalendar: false, position: newValue?.length + 1, media: selectedMedia });
                    }

                    setFieldValue(name, newValue);
                }}
                AddMediaLabel="Ajouter"
                RemoveMediaLabel="Retirer"
                mediaFilters={mediasFilters}
                setMediaFilters={setMediasFilters}
                total={mediasTotal}
                categoriesList={mediaCategoriesList}
                updatedMedia={updatedMedia}
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
                updatedMedia={updatedMedia}
            />
        </>
    );
};
