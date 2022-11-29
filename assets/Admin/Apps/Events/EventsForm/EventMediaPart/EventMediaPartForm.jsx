import React, { useEffect, useMemo, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';

import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { getMediaType } from '@Services/utils/getMediaType';

export const EventMediaPartForm = ({
    values,
    handleChange,
    errors,
    setFieldValue,
    name = 'eventMedias',
}) => {
    const dispatch = useDispatch();
    const [openAddModal, setOpenAddModal] = useState(null);
    const [editDialog, setEditDialog] = useState(null);
    const [imageMedias, setImageMedias] = useState(null);
    const [otherMedias, setOtherMedias] = useState(null);

    const getMedias = async () => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.mediasApi.getAllMedias();
            if (!result?.result) {
                NotificationManager.error(
                    'Une erreur est survenue, essayez de rafraichir la page.',
                    'Erreur',
                    Constant.REDIRECTION_TIME
                );
            }

            const images =
                result?.medias?.filter((el) => getMediaType(el.documentType) === 'image') || [];
            setImageMedias(images);

            const others =
                result?.medias?.filter((el) => getMediaType(el.documentType) !== 'image') || [];
            setOtherMedias(others);
        });
    };

    const mediaList = useMemo(() => {
        if (!openAddModal) {
            return [];
        }

        if (openAddModal === 'Image') {
            return imageMedias;
        } else if (openAddModal === 'Other') {
            return otherMedias;
        }

        return [];
    }, [imageMedias, otherMedias, openAddModal]);

    useEffect(() => {
        getMedias();
    }, []);

    const getResultList = (list) => {
        const resultList = [];

        if (!list) {
            return [];
        }

        values?.eventMedias?.forEach((el) => {
            const search = list.find((it) => it.id === el.id);
            if (search) {
                resultList.push(search);
            }
        });

        return resultList;
    };

    return (
        <>
            <Component.DisplayEventMediaElement
                title="Photos"
                openAddModal={setOpenAddModal}
                mediaType="Image"
                mediaList={getResultList(imageMedias)}
                openEditModal={setEditDialog}
                values={values}
                name={name}
                setFieldValue={setFieldValue}
                id="imageMediasEvent"
            />
            <Component.DisplayEventMediaElement
                title="Autres contenus"
                openAddModal={setOpenAddModal}
                mediaType="Other"
                mediaList={getResultList(otherMedias)}
                openEditModal={setEditDialog}
                values={values}
                name={name}
                setFieldValue={setFieldValue}
                id="othersMediasEvent"
            />

            <Component.AddEventMediaModal
                open={Boolean(openAddModal)}
                closeModal={() => setOpenAddModal(null)}
                mediaList={mediaList}
                values={values}
                name={name}
                setFieldValue={setFieldValue}
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
            />
        </>
    );
};
