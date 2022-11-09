import {
    Button,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CreateButton } from '../../../Components/CmtButton/sc.Buttons';
import { CmtCard } from '../../../Components/CmtCard/sc.CmtCard';
import { CmtPageWrapper } from '../../../Components/CmtPage/CmtPageWrapper/CmtPageWrapper';
import { CmtPagination } from '../../../Components/CmtPagination/CmtPagination';
import { DeleteDialog } from '../../../Components/DeleteDialog/DeleteDialog';
import { ListTable } from '../../../Components/ListTable/ListTable';
import { CONTENT_BASE_PATH, CREATE_PATH, EDIT_PATH, REDIRECTION_TIME } from '../../../Constant';
import {
    changeContentsFilters,
    contentsSelector,
    getContentsAction,
} from '../../../redux/contents/contentsSlice';
import { loginFailure } from '../../../redux/profile/profileSlice';
import authApi from '../../../services/api/authApi';
import contentsApi from '../../../services/api/contentsApi';
import contentTypesApi from '../../../services/api/contentTypesApi';
import { apiMiddleware } from '../../../services/utils/apiMiddleware';
import { ContentsFilters } from './ContentsFilters/ContentsFilters';

const TABLE_COLUMN = [
    { name: 'id', label: 'ID', width: '10%', sortable: true },
    { name: 'active', label: 'Activé ?', type: 'bool', width: '10%', sortable: true },
    { name: 'title', label: 'Titre', width: '40%', sortable: true },
    { name: 'contentType.name', label: 'Type de contenu', width: '30%', sortable: true },
];

export const ContentsList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, contents, filters, total, error } = useSelector(contentsSelector);
    const [contentTypes, setContentTypes] = useState([]);
    const [deleteDialog, setDeleteDialog] = useState(null);
    const [createDialog, setCreateDialog] = useState(false);
    const [formContentType, setFormContentType] = useState('');

    useEffect(() => {
        if (!loading && !contents && !error) {
            dispatch(getContentsAction());
        }

        apiMiddleware(dispatch, async () => {
            const result = await contentTypesApi.getAllContentTypes();

            if (result?.result) {
                setContentTypes(result?.contentTypes);
            }
        });
    }, []);

    const handleDelete = async (id) => {
        const check = await authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        await contentsApi.deleteContent(id);

        dispatch(getContentsAction());

        setDeleteDialog(null);
    };

    const handleDuplicate = (id) => {
        apiMiddleware(dispatch, async () => {
            const result = await contentsApi.duplicateContent(id);

            if (result?.result) {
                NotificationManager.success(
                    'Le contenu a bien été dupliqué.',
                    'Succès',
                    REDIRECTION_TIME
                );

                dispatch(getContentsAction());
            } else {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', REDIRECTION_TIME);
            }
        });
    };

    return (
        <>
            <CmtPageWrapper title="Contenus">
                <CmtCard sx={{ width: '100%', mt: 5 }}>
                    <CardContent>
                        <Box display="flex" justifyContent="space-between">
                            <Typography component="h2" variant="h5" fontSize={20}>
                                Liste des contenus{' '}
                                {contents &&
                                    `(${(filters.page - 1) * filters.limit + 1} - ${
                                        (filters.page - 1) * filters.limit + contents.length
                                    } sur ${total})`}
                            </Typography>
                            <CreateButton variant="contained" onClick={() => setCreateDialog(true)}>
                                Nouveau
                            </CreateButton>
                        </Box>

                        <ContentsFilters
                            filters={filters}
                            changeFilters={(values) => dispatch(changeContentsFilters(values))}
                            list={contentTypes}
                        />

                        <ListTable
                            filters={filters}
                            contextualMenu
                            table={TABLE_COLUMN}
                            list={contents}
                            onEdit={(id) => {
                                navigate(`${CONTENT_BASE_PATH}/${id}${EDIT_PATH}`);
                            }}
                            onDuplicate={(id) => {
                                handleDuplicate(id);
                            }}
                            changeFilters={(newFilters) =>
                                dispatch(changeContentsFilters(newFilters))
                            }
                            onDelete={(id) => setDeleteDialog(id)}
                        />

                        <CmtPagination
                            page={filters.page}
                            total={total}
                            limit={filters.limit}
                            setPage={(newValue) =>
                                dispatch(changeContentsFilters({ ...filters }, newValue))
                            }
                            setLimit={(newValue) => {
                                dispatch(changeContentsFilters({ ...filters, limit: newValue }));
                            }}
                            length={contents?.length}
                        />
                    </CardContent>
                </CmtCard>
            </CmtPageWrapper>

            <Dialog
                open={createDialog}
                onClose={() => setCreateDialog(false)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle sx={{ fontSize: 20 }}>Créer un contenu</DialogTitle>
                <DialogContent dividers>
                    <FormControl fullWidth sx={{ marginTop: 3 }}>
                        <InputLabel id={`contentType-label`} size="small">
                            Type de contenus
                        </InputLabel>
                        <Select
                            labelId={`contentType-label`}
                            variant="standard"
                            size="small"
                            id={`contentType`}
                            value={formContentType}
                            onChange={(e) => {
                                setFormContentType(e.target.value);
                            }}
                            label="Type de contenus"
                        >
                            {contentTypes?.contentTypes?.map((typeList, typeIndex) => (
                                <MenuItem key={typeIndex} value={typeList?.id}>
                                    {typeList?.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>

                <DialogActions>
                    <Box
                        width="100%"
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Button
                            color="error"
                            onClick={() => {
                                setCreateDialog(false);
                                setFormContentType('');
                            }}
                            id="cancelDialog"
                        >
                            Annuler
                        </Button>
                        <Button
                            color="primary"
                            onClick={() => {
                                if (formContentType !== '') {
                                    navigate(
                                        `${CONTENT_BASE_PATH}${CREATE_PATH}?contentType=${formContentType}`
                                    );
                                } else {
                                    NotificationManager.error(
                                        'Vous devez renseigner le type de contenu.',
                                        'Erreur',
                                        REDIRECTION_TIME
                                    );
                                }
                            }}
                            id="validateDialog"
                        >
                            Suivant
                        </Button>
                    </Box>
                </DialogActions>
            </Dialog>

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
