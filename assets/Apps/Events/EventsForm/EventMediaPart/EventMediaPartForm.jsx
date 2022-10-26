import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { apiMiddleware } from '../../../../services/utils/apiMiddleware';
import mediasApi from '../../../../services/api/mediasApi';
import { NotificationManager } from 'react-notifications';
import { REDIRECTION_TIME } from '../../../../Constant';
import { getMediaType } from '../../../../services/utils/getMediaType';
import { AddEventMediaModal } from './AddEventMediaModal';
import { EditEventMediaModal } from './EditEventMediaModal';
import { DisplayEventMediaElement } from './DisplayEventMediaElement';

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
            const result = await mediasApi.getAllMedias();
            if (!result?.result) {
                NotificationManager.error(
                    'Une erreur est survenue, essayez de rafraichir la page.',
                    'Erreur',
                    REDIRECTION_TIME
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

        console.log(openAddModal);
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
            <DisplayEventMediaElement
                title="Photos"
                openAddModal={setOpenAddModal}
                mediaType="Image"
                mediaList={getResultList(imageMedias)}
                openEditModal={setEditDialog}
                values={values}
                name={name}
                setFieldValue={setFieldValue}
            />
            <DisplayEventMediaElement
                title="Autres contenus"
                openAddModal={setOpenAddModal}
                mediaType="Other"
                mediaList={getResultList(otherMedias)}
                openEditModal={setEditDialog}
                values={values}
                name={name}
                setFieldValue={setFieldValue}
            />

            <AddEventMediaModal
                open={Boolean(openAddModal)}
                closeModal={() => setOpenAddModal(null)}
                mediaList={mediaList}
                values={values}
                name={name}
                setFieldValue={setFieldValue}
            />

            <EditEventMediaModal
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
