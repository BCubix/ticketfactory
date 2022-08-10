import { categoriesSelector } from '@Redux/categories/categoriesSlice';
import { Button, Card, CardContent, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PageTitle } from '@Components/Page/PageTitle/PageTitle';
import { PageWrapper } from '@Components/Page/PageWrapper/sc.PageWrapper';
import { ListTable } from '@Components/ListTable/ListTable';
import { Box } from '@mui/system';
import { useNavigate, useParams } from 'react-router-dom';
import { DeleteDialog } from '@Components/DeleteDialog/DeleteDialog';
import { useState } from 'react';
import { CREATE_PATH, EDIT_PATH, CATEGORIES_BASE_PATH } from '../../../Constant';
import categoriesApi from '../../../services/api/categoriesApi';
import { getCategoriesAction } from '../../../redux/categories/categoriesSlice';
import authApi from '../../../services/api/authApi';
import { loginFailure } from '../../../redux/profile/profileSlice';
import { NotificationManager } from 'react-notifications';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { EditCategoryLink } from './sc.EditCategoryLink';

const TABLE_COLUMN = [
    { name: 'id', label: 'ID', width: '10%' },
    { name: 'active', label: 'Activé ?', type: 'bool', width: '10%' },
    { name: 'name', label: 'Nom de la catégorie', width: '70%' },
];

export const CategoriesList = () => {
    const { loading, categories, error } = useSelector(categoriesSelector);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [deleteDialog, setDeleteDialog] = useState(null);
    const [category, setCategory] = useState(null);
    const [path, setPath] = useState(null);

    const getCategory = async (id) => {
        const check = await authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await categoriesApi.getOneCategory(id);

        if (!result.result) {
            NotificationManager.error("Une erreur s'est produite", 'Erreur', REDIRECTION_TIME);

            navigate(CATEGORIES_BASE_PATH);

            return;
        }

        setCategory(result.category);
    };

    useEffect(() => {
        if (!id && !loading && !categories && !error) {
            dispatch(getCategoriesAction());
            return;
        } else if (id) {
            getCategory(id);
        }

        if (!id && categories) {
            setCategory(categories);
        }
    }, [id, loading, categories, error]);

    useEffect(() => {
        if (!category) {
            setPath(null);
        }

        let pathArray = [];
        let categoryCopy = { ...category };

        while (categoryCopy !== null) {
            pathArray.push({ name: categoryCopy.name, id: categoryCopy.id });

            categoryCopy = categoryCopy.parent ? { ...categoryCopy.parent } : null;
        }
        setPath(pathArray.reverse());
    }, [category]);
    const handleDelete = async (id) => {
        await categoriesApi.deleteCategory(id);

        dispatch(getCategoriesAction());

        setDeleteDialog(null);
    };

    return (
        <>
            <PageWrapper>
                <PageTitle>Catégories</PageTitle>

                <Box display="flex" alignItems="center" pt={5}>
                    {path?.map((item, index) => (
                        <Box pl={2} key={index} display="flex" alignItems="center">
                            <ArrowForwardIosIcon style={{ fontSize: 12 }} />
                            <Box
                                pl={2}
                                onClick={() => navigate(`${CATEGORIES_BASE_PATH}/${item?.id}`)}
                                className="link"
                            >
                                <Typography component="span" variant="body1">
                                    {item?.name}
                                </Typography>
                            </Box>
                        </Box>
                    ))}

                    <Box
                        pl={3}
                        onClick={() => navigate(`${CATEGORIES_BASE_PATH}/${id}${EDIT_PATH}`)}
                    >
                        <EditCategoryLink component="span" variant="body1">
                            Modifier
                        </EditCategoryLink>
                    </Box>
                </Box>

                <Card sx={{ width: '100%', mt: 2 }}>
                    <CardContent>
                        <Box display="flex" justifyContent="space-between">
                            <Typography component="h2" variant="h5" fontSize={20}>
                                Catégories ({category?.children?.length})
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
                            list={category?.children}
                            onEdit={(id) => {
                                navigate(`${CATEGORIES_BASE_PATH}/${id}${EDIT_PATH}`);
                            }}
                            onDelete={(id) => setDeleteDialog(id)}
                            onClick={(elemId) => {
                                navigate(`${CATEGORIES_BASE_PATH}/${elemId}`);
                            }}
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
                        Êtes-vous sûr de vouloir supprimer cette catégorie ?
                    </Typography>

                    <Typography component="p">Cette action est irréversible.</Typography>
                </Box>
            </DeleteDialog>
        </>
    );
};
