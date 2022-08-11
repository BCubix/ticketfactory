import { tagsSelector } from '@Redux/tags/tagsSlice';
import { Button, Card, CardContent, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CmtPageTitle } from '@Components/CmtPage/CmtPageTitle/CmtPageTitle';
import { CmtPageWrapper } from '@Components/CmtPage/CmtPageWrapper/CmtPageWrapper';
import { ListTable } from '@Components/ListTable/ListTable';
import { Box } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { DeleteDialog } from '@Components/DeleteDialog/DeleteDialog';
import { useState } from 'react';
import { CREATE_PATH, EDIT_PATH, TAGS_BASE_PATH } from '../../../Constant';
import tagsApi from '../../../services/api/tagsApi';
import { getTagsAction } from '../../../redux/tags/tagsSlice';

const TABLE_COLUMN = [
    { name: 'id', label: 'ID' },
    { name: 'active', label: 'Activé ?', type: 'bool' },
    { name: 'name', label: 'Nom de la catégorie' },
];

export const TagsList = () => {
    const { loading, tags, error } = useSelector(tagsSelector);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [deleteDialog, setDeleteDialog] = useState(null);

    useEffect(() => {
        if (!loading && !tags && !error) {
            dispatch(getTagsAction());
        }
    }, []);

    const handleDelete = async (id) => {
        await tagsApi.deleteTag(id);

        dispatch(getTagsAction());

        setDeleteDialog(null);
    };

    return (
        <>
            <CmtPageWrapper>
                <CmtPageTitle>Tags</CmtPageTitle>
                <Card sx={{ width: '100%', mt: 5 }}>
                    <CardContent>
                        <Box display="flex" justifyContent="space-between">
                            <Typography component="h2" variant="h5" fontSize={20}>
                                Tags ({tags?.length})
                            </Typography>
                            <Button
                                variant="contained"
                                onClick={() => navigate(TAGS_BASE_PATH + CREATE_PATH)}
                            >
                                Nouveau
                            </Button>
                        </Box>

                        <ListTable
                            table={TABLE_COLUMN}
                            list={tags}
                            onEdit={(id) => {
                                navigate(`${TAGS_BASE_PATH}/${id}${EDIT_PATH}`);
                            }}
                            onDelete={(id) => setDeleteDialog(id)}
                        />
                    </CardContent>
                </Card>
            </CmtPageWrapper>
            <DeleteDialog
                open={deleteDialog ? true : false}
                onCancel={() => setDeleteDialog(null)}
                onDelete={() => handleDelete(deleteDialog)}
            >
                <Box textAlign="center" py={3}>
                    <Typography component="p">
                        Êtes-vous sûr de vouloir supprimer ce tag ?
                    </Typography>

                    <Typography component="p">Cette action est irréversible.</Typography>
                </Box>
            </DeleteDialog>
        </>
    );
};
