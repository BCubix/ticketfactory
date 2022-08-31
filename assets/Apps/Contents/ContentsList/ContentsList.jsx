import {
    Button,
    Card,
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
import { CmtPageWrapper } from '../../../Components/CmtPage/CmtPageWrapper/CmtPageWrapper';
import { DeleteDialog } from '../../../Components/DeleteDialog/DeleteDialog';
import { ListTable } from '../../../Components/ListTable/ListTable';
import { CONTENT_BASE_PATH, CREATE_PATH, EDIT_PATH, REDIRECTION_TIME } from '../../../Constant';
import { contentsSelector, getContentsAction } from '../../../redux/contents/contentsSlice';
import {
    contentTypesSelector,
    getContentTypesAction,
} from '../../../redux/contentTypes/contentTypesSlice';
import contentsApi from '../../../services/api/contentsApi';

const TABLE_COLUMN = [
    { name: 'id', label: 'ID' },
    { name: 'active', label: 'Activé ?', type: 'bool' },
    { name: 'type', label: 'Catégory du contenu' },
];

export const ContentsList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, contents, error } = useSelector(contentsSelector);
    const contentTypes = useSelector(contentTypesSelector);
    const [deleteDialog, setDeleteDialog] = useState(null);
    const [createDialog, setCreateDialog] = useState(false);
    const [formContentType, setFormContentType] = useState('');

    useEffect(() => {
        if (!loading && !contents && !error) {
            dispatch(getContentsAction());
        }

        if (!contentTypes?.loading && !contentTypes?.contentTypes && !contentTypes?.error) {
            dispatch(getContentTypesAction());
        }
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

    return (
        <>
            <CmtPageWrapper title="Contenus">
                <Card sx={{ width: '100%', mt: 5 }}>
                    <CardContent>
                        <Box display="flex" justifyContent="space-between">
                            <Typography component="h2" variant="h5" fontSize={20}>
                                Contenus ({contents?.length})
                            </Typography>
                            <Button variant="contained" onClick={() => setCreateDialog(true)}>
                                Nouveau
                            </Button>
                        </Box>

                        <ListTable
                            table={TABLE_COLUMN}
                            list={contents}
                            onEdit={(id) => {
                                navigate(`${CONTENT_BASE_PATH}/${id}${EDIT_PATH}`);
                            }}
                            onDelete={(id) => setDeleteDialog(id)}
                        />
                    </CardContent>
                </Card>
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
