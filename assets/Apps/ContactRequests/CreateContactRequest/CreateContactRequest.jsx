import React from 'react';
import { NotificationManager } from 'react-notifications';
import { CONTACT_REQUEST_BASE_PATH, REDIRECTION_TIME } from '../../../Constant';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import authApi from '../../../services/api/authApi';
import { loginFailure } from '../../../redux/profile/profileSlice';
import contactRequestsApi from '../../../services/api/contactRequestsApi';
import { getContactRequestsAction } from '../../../redux/contactRequests/contactRequestsSlice';
import { ContactRequestsForm } from '../ContactRequestsForm/ContactRequestsForm';

export const CreateContactRequests = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        const check = await authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await contactRequestsApi.createContactRequest(values);

        if (result.result) {
            NotificationManager.success(
                'La demande de contact à bien été crée.',
                'Succès',
                REDIRECTION_TIME
            );

            dispatch(getContactRequestsAction());

            navigate(CONTACT_REQUEST_BASE_PATH);
        }
    };

    return <ContactRequestsForm handleSubmit={handleSubmit} />;
};
