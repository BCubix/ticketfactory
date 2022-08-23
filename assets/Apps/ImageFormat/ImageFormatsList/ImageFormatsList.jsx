import React, { useEffect, useState } from 'react';
import { Button, Card, CardContent, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CmtPageWrapper } from '../../../Components/CmtPage/CmtPageWrapper/CmtPageWrapper';
import { ListTable } from '../../../Components/ListTable/ListTable';
import { CREATE_PATH, EDIT_PATH, IMAGE_FORMATS_BASE_PATH } from '../../../Constant';
import {
    getImageFormatsAction,
    imageFormatsSelector,
} from '../../../redux/imageFormats/imageFormatSlice';
import imageFormatsApi from '../../../services/api/imageFormatsApi';
import { DeleteDialog } from '../../../Components/DeleteDialog/DeleteDialog';

const TABLE_COLUMN = [
    { name: 'id', label: 'ID' },
    { name: 'active', label: 'Activé ?', type: 'bool' },
    { name: 'name', label: 'Nom' },
    { name: 'length', label: 'Largeur' },
    { name: 'height', label: 'Hauteur' },
];

export const ImageFormatsList = () => {
    const { loading, imageFormats, error } = useSelector(imageFormatsSelector);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [deleteDialog, setDeleteDialog] = useState(null);

    useEffect(() => {
        if (!loading && !imageFormats && !error) {
            dispatch(getImageFormatsAction());
        }
    }, []);

    const handleDelete = async (id) => {
        await imageFormatsApi.deleteImageFormat(id);

        dispatch(getImageFormatsAction());

        setDeleteDialog(null);
    };

    return (
        <>
            <CmtPageWrapper title="Formats D'image">
                <Card sx={{ width: '100%', mt: 5 }}>
                    <CardContent>
                        <Box display="flex" justifyContent="space-between">
                            <Typography component="h2" variant="h5" fontSize={20}>
                                Format d'image ({imageFormats?.length})
                            </Typography>
                            <Button
                                variant="contained"
                                onClick={() => navigate(IMAGE_FORMATS_BASE_PATH + CREATE_PATH)}
                            >
                                Nouveau
                            </Button>
                        </Box>

                        <ListTable
                            table={TABLE_COLUMN}
                            list={imageFormats}
                            onEdit={(id) => {
                                navigate(`${IMAGE_FORMATS_BASE_PATH}/${id}${EDIT_PATH}`);
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
                        Êtes-vous sûr de vouloir supprimer ce format d'image ?
                    </Typography>

                    <Typography component="p">Cette action est irréversible.</Typography>
                </Box>
            </DeleteDialog>
        </>
    );
};
