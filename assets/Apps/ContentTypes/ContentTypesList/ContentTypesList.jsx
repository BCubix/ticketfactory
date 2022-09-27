import { Button, Card, CardContent, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CreateButton } from '../../../Components/CmtButton/sc.Buttons';
import { CmtCard } from '../../../Components/CmtCard/sc.CmtCard';
import { CmtPageWrapper } from '../../../Components/CmtPage/CmtPageWrapper/CmtPageWrapper';
import { DeleteDialog } from '../../../Components/DeleteDialog/DeleteDialog';
import { ListTable } from '../../../Components/ListTable/ListTable';
import { CONTENT_TYPES_BASE_PATH, CREATE_PATH, EDIT_PATH } from '../../../Constant';
import {
    contentTypesSelector,
    getContentTypesAction,
} from '../../../redux/contentTypes/contentTypesSlice';
import { loginFailure } from '../../../redux/profile/profileSlice';
import authApi from '../../../services/api/authApi';
import contentTypesApi from '../../../services/api/contentTypesApi';

const TABLE_COLUMN = [
    { name: 'id', label: 'ID', width: '10%' },
    { name: 'active', label: 'Activé ?', type: 'bool', width: '10%' },
    { name: 'name', label: 'Nom de la catégorie', width: '70%' },
];

export const ContentTypesList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, contentTypes, error } = useSelector(contentTypesSelector);
    const [deleteDialog, setDeleteDialog] = useState(null);

    useEffect(() => {
        if (!loading && !contentTypes && !error) {
            dispatch(getContentTypesAction());
        }
    }, []);

    const handleDelete = async (id) => {
        const check = await authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        await contentTypesApi.deleteContentType(id);

        dispatch(getContentTypesAction());

        setDeleteDialog(null);
    };

    return (
        <>
            <CmtPageWrapper title="Types de contenus">
                <CmtCard sx={{ width: '100%', mt: 5 }}>
                    <CardContent>
                        <Box display="flex" justifyContent="space-between">
                            <Typography component="h2" variant="h5" fontSize={20}>
                                Liste des types de contenus
                            </Typography>
                            <CreateButton
                                variant="contained"
                                onClick={() => navigate(CONTENT_TYPES_BASE_PATH + CREATE_PATH)}
                            >
                                Nouveau
                            </CreateButton>
                        </Box>

                        <ListTable
                            table={TABLE_COLUMN}
                            list={contentTypes}
                            onEdit={(id) => {
                                navigate(`${CONTENT_TYPES_BASE_PATH}/${id}${EDIT_PATH}`);
                            }}
                            onDelete={(id) => setDeleteDialog(id)}
                        />
                    </CardContent>
                </CmtCard>
            </CmtPageWrapper>
            <DeleteDialog
                open={deleteDialog ? true : false}
                onCancel={() => setDeleteDialog(null)}
                onDelete={() => handleDelete(deleteDialog)}
            >
                <Box textAlign="center" py={3}>
                    <Typography component="p">
                        Êtes-vous sûr de vouloir supprimer ce type de contenus ?
                    </Typography>

                    <Typography component="p">Cette action est irréversible.</Typography>
                </Box>
            </DeleteDialog>
        </>
    );
};
