import { categoriesSelector } from '@Redux/categories/categoriesSlice';
import { CardContent, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CmtPageWrapper } from '@Components/CmtPage/CmtPageWrapper/CmtPageWrapper';
import { ListTable } from '@Components/ListTable/ListTable';
import { Box } from '@mui/system';
import { useNavigate, useParams } from 'react-router-dom';
import { DeleteDialog } from '@Components/DeleteDialog/DeleteDialog';
import { useState } from 'react';
import { CREATE_PATH, EDIT_PATH, CATEGORIES_BASE_PATH, REDIRECTION_TIME } from '../../../Constant';
import categoriesApi from '../../../services/api/categoriesApi';
import { getCategoriesAction } from '../../../redux/categories/categoriesSlice';
import authApi from '../../../services/api/authApi';
import { loginFailure } from '../../../redux/profile/profileSlice';
import { NotificationManager } from 'react-notifications';
import { EditCategoryLink } from './sc.EditCategoryLink';
import { CmtBreadCrumb } from '../../../Components/CmtBreadCrumb/CmtBreadCrumb';
import { CmtCard } from '../../../Components/CmtCard/sc.CmtCard';
import { CreateButton } from '../../../Components/CmtButton/sc.Buttons';
import { apiMiddleware } from '../../../services/utils/apiMiddleware';

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
    const [deleteEvents, setDeleteEvent] = useState(false);
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
            pathArray.push({
                label: categoryCopy.name,
                path: `${CATEGORIES_BASE_PATH}/${categoryCopy.id}`,
            });

            categoryCopy = categoryCopy.parent ? { ...categoryCopy.parent } : null;
        }
        setPath(pathArray.reverse());
    }, [category]);

    const handleDelete = async (deleteId, deleteEvents) => {
        const check = await authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        await categoriesApi.deleteCategory(deleteId, deleteEvents);

        dispatch(getCategoriesAction());

        setDeleteDialog(null);
        setDeleteEvent(false);
    };

    const handleDuplicate = (id) => {
        apiMiddleware(dispatch, async () => {
            const result = await categoriesApi.duplicateCategory(id);

            if (result?.result) {
                NotificationManager.success(
                    'La catégorie a bien été dupliquée.',
                    'Succès',
                    REDIRECTION_TIME
                );

                dispatch(getCategoriesAction());
            } else {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', REDIRECTION_TIME);
            }
        });
    };

    return (
        <>
            <CmtPageWrapper title="Catégories">
                <Box display="flex" alignItems="center" pt={5}>
                    <CmtBreadCrumb list={path} />
                    <Box
                        pl={3}
                        onClick={() =>
                            navigate(`${CATEGORIES_BASE_PATH}/${id || categories.id}${EDIT_PATH}`)
                        }
                    >
                        <EditCategoryLink component="span" variant="body1">
                            Modifier
                        </EditCategoryLink>
                    </Box>
                </Box>

                <CmtCard sx={{ width: '100%', mt: 2 }}>
                    <CardContent>
                        <Box display="flex" justifyContent="space-between">
                            <Typography component="h2" variant="h5" fontSize={20}>
                                Liste des catégories
                            </Typography>
                            <CreateButton
                                variant="contained"
                                onClick={() => navigate(CATEGORIES_BASE_PATH + CREATE_PATH)}
                            >
                                Nouveau
                            </CreateButton>
                        </Box>

                        <ListTable
                            contextualMenu
                            table={TABLE_COLUMN}
                            list={category?.children}
                            onEdit={(id) => {
                                navigate(`${CATEGORIES_BASE_PATH}/${id}${EDIT_PATH}`);
                            }}
                            onDelete={(id) => setDeleteDialog(id)}
                            onClick={(elemId) => {
                                navigate(`${CATEGORIES_BASE_PATH}/${elemId}`);
                            }}
                            onDuplicate={(id) => {
                                handleDuplicate(id);
                            }}
                        />
                    </CardContent>
                </CmtCard>
            </CmtPageWrapper>

            <DeleteDialog
                open={deleteDialog ? true : false}
                onCancel={() => {
                    setDeleteDialog(null);
                    setDeleteEvent(false);
                }}
                deleteText={'Valider'}
                onDelete={() => handleDelete(deleteDialog, deleteEvents)}
            >
                <Box textAlign="center" py={3}>
                    <Typography component="p">
                        Voulez-vous supprimer les évènements qui sont rattachés à cette catégorie ou
                        souhaitez-vous les rattacher à la catégorie parente ?
                    </Typography>

                    <Box className="flex row-center" mt={5}>
                        <RadioGroup
                            defaultValue={false}
                            name="delete-event-radio-choice"
                            value={deleteEvents}
                            onChange={(e) => {
                                setDeleteEvent(e.target.value);
                            }}
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-around',
                                width: '100%',
                            }}
                        >
                            <FormControlLabel value={true} control={<Radio />} label={'Suprimer'} />
                            <FormControlLabel
                                value={false}
                                control={<Radio />}
                                label={'Rattacher à la catégorie parente'}
                            />
                        </RadioGroup>
                    </Box>
                </Box>
            </DeleteDialog>
        </>
    );
};
