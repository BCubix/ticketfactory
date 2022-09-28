import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { CONTACT_REQUEST_BASE_PATH, REDIRECTION_TIME } from '../../../Constant';
import authApi from '../../../services/api/authApi';
import { loginFailure } from '../../../redux/profile/profileSlice';
import contactRequestsApi from '../../../services/api/contactRequestsApi';
import { ContactRequestsForm } from '../ContactRequestsForm/ContactRequestsForm';
import { getContactRequestsAction } from '../../../redux/contactRequests/contactRequestsSlice';

export const EditContactRequest = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [contactRequest, setContactRequest] = useState(null);

    const getContactRequest = async (id) => {
        const check = await authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await contactRequestsApi.getOneContactRequest(id);

        if (!result.result) {
            NotificationManager.error("Une erreur s'est produite", 'Erreur', REDIRECTION_TIME);

            navigate(CONTACT_REQUEST_BASE_PATH);

            return;
        }

        setContactRequest(result.contactRequest);
    };

    useEffect(() => {
        if (!id) {
            navigate(CONTACT_REQUEST_BASE_PATH);
            return;
        }

        getContactRequest(id);
    }, [id]);

    const handleSubmit = async (values) => {
        const check = await authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await contactRequestsApi.editContactRequest(id, values);

        if (result.result) {
            NotificationManager.success(
                'La demande de contact à bien été modifié.',
                'Succès',
                REDIRECTION_TIME
            );

            dispatch(getContactRequestsAction());

            navigate(CONTACT_REQUEST_BASE_PATH);
        }
    };

    if (!contactRequest) {
        return <></>;
    }

    return <ContactRequestsForm handleSubmit={handleSubmit} initialValues={contactRequest} />;
};
