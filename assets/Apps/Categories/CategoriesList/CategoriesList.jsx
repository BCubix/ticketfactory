import { categoriesSelector } from '@Redux/categories/categoriesSlice';
import { Button, Card, CardContent, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PageTitle } from '@Components/Page/PageTitle/PageTitle';
import { PageWrapper } from '@Components/Page/PageWrapper/sc.PageWrapper';
import { ListTable } from '@Components/ListTable/ListTable';
import { Box } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { DeleteDialog } from '@Components/DeleteDialog/DeleteDialog';
import { useState } from 'react';
import { CREATE_PATH, EDIT_PATH, CATEGORIES_BASE_PATH } from '../../../Constant';
import categoriesApi from '../../../services/api/categoriesApi';
import { getCategoriesAction } from '../../../redux/categories/categoriesSlice';

const TABLE_COLUMN = [
    { name: 'id', label: 'ID' },
    { name: 'active', label: 'Activé ?', type: 'bool' },
    { name: 'name', label: 'Nom de la catégorie' },
];

export const CategoriesList = () => {
    const { loading, categories, error } = useSelector(categoriesSelector);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [deleteDialog, setDeleteDialog] = useState(null);

    useEffect(() => {
        if (!loading && !categories && !error) {
            dispatch(getCategoriesAction());
        }
    }, []);

    const handleDelete = async (id) => {
        await categoriesApi.deleteCategory(id);

        dispatch(getCategoriesAction());

        setDeleteDialog(null);
    };

    return (
        <>
            <PageWrapper>
                <PageTitle>Catégories</PageTitle>
                <Card sx={{ width: '100%', mt: 5 }}>
                    <CardContent>
                        <Box display="flex" justifyContent="space-between">
                            <Typography component="h2" variant="h5" fontSize={20}>
                                Catégories ({categories?.length})
                            </Typography>
                            <Button
                                variant="contained"
                                onClick={() => navigate(CATEGORIES_BASE_PATH + CREATE_PATH)}
                            >
                                Nouveau
                            </Button>
                        </Box>

                        <ListTable
                            table={TABLE_COLUMN}
                            list={categories}
                            onEdit={(id) => {
                                navigate(`${CATEGORIES_BASE_PATH}/${id}${EDIT_PATH}`);
                            }}
                            onDelete={(id) => setDeleteDialog(id)}
                        />
                    </CardContent>
                </Card>
            </PageWrapper>
            <DeleteDialog
                open={deleteDialog ? true : false}
                onCancel={() => setDeleteDialog(null)}
                onDelete={() => handleDelete(deleteDialog)}
            >
                <Box textAlign="center" py={3}>
                    <Typography component="p">
                        Êtes-vous sûr de vouloir supprimer cet utilisateur ?
                    </Typography>

                    <Typography component="p">Cette action est irréversible.</Typography>
                </Box>
            </DeleteDialog>
        </>
    );
};
