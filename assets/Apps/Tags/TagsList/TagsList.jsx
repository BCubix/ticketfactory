import { tagsSelector } from '@Redux/tags/tagsSlice';
import { CardContent, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CmtPageWrapper } from '@Components/CmtPage/CmtPageWrapper/CmtPageWrapper';
import { ListTable } from '@Components/ListTable/ListTable';
import { Box } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { DeleteDialog } from '@Components/DeleteDialog/DeleteDialog';
import { useState } from 'react';
import { CREATE_PATH, EDIT_PATH, TAGS_BASE_PATH } from '../../../Constant';
import tagsApi from '../../../services/api/tagsApi';
import { changeTagsFilters, getTagsAction } from '../../../redux/tags/tagsSlice';
import { CmtCard } from '../../../Components/CmtCard/sc.CmtCard';
import { CreateButton } from '../../../Components/CmtButton/sc.Buttons';
import { TagsFilters } from './TagsFilters/TagsFilters';
import { CmtPagination } from '../../../Components/CmtPagination/CmtPagination';

const TABLE_COLUMN = [
    { name: 'id', label: 'ID', width: '10%', sortable: true },
    { name: 'active', label: 'Activé ?', type: 'bool', width: '10%', sortable: true },
    { name: 'name', label: 'Nom de la catégorie', width: '70%', sortable: true },
];

export const TagsList = () => {
    const { loading, tags, filters, total, error } = useSelector(tagsSelector);
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
            <CmtPageWrapper title="Tags">
                <CmtCard sx={{ width: '100%', mt: 5 }}>
                    <CardContent>
                        <Box display="flex" justifyContent="space-between">
                            <Typography component="h2" variant="h5" fontSize={20}>
                                Liste des tags{' '}
                                {tags &&
                                    `(${(filters.page - 1) * filters.limit + 1} - ${
                                        (filters.page - 1) * filters.limit + tags.length
                                    } sur ${total})`}
                            </Typography>
                            <CreateButton
                                variant="contained"
                                onClick={() => navigate(TAGS_BASE_PATH + CREATE_PATH)}
                            >
                                Nouveau
                            </CreateButton>
                        </Box>

                        <TagsFilters
                            filters={filters}
                            changeFilters={(values) => dispatch(changeTagsFilters(values))}
                        />

                        <ListTable
                            table={TABLE_COLUMN}
                            list={tags}
                            onEdit={(id) => {
                                navigate(`${TAGS_BASE_PATH}/${id}${EDIT_PATH}`);
                            }}
                            onDelete={(id) => setDeleteDialog(id)}
                            filters={filters}
                            changeFilters={(newFilters) => dispatch(changeTagsFilters(newFilters))}
                        />

                        <CmtPagination
                            page={filters.page}
                            total={total}
                            limit={filters.limit}
                            setPage={(newValue) =>
                                dispatch(changeTagsFilters({ ...filters }, newValue))
                            }
                            setLimit={(newValue) => {
                                dispatch(changeTagsFilters({ ...filters, limit: newValue }));
                            }}
                            length={tags?.length}
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
                        Êtes-vous sûr de vouloir supprimer ce tag ?
                    </Typography>

                    <Typography component="p">Cette action est irréversible.</Typography>
                </Box>
            </DeleteDialog>
        </>
    );
};
