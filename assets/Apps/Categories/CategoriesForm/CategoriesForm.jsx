import { TreeItem, TreeView } from '@mui/lab';
import { Button, FormControlLabel, Radio, Switch, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { Formik } from 'formik';
import React from 'react';
import * as Yup from 'yup';
import { CmtFormBlock } from '../../../Components/CmtFormBlock/CmtFormBlock';
import { CmtTextField } from '../../../Components/CmtTextField/CmtTextField';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export const CategoriesForm = ({ handleSubmit, initialValues = null, categoriesList = null }) => {
    const categorySchema = Yup.object().shape({
        name: Yup.string().required('Veuillez renseigner le nom de la categorie.'),
        parent: Yup.string().required('Veuillez renseigner une catégorie parente.'),
    });

    if (!categoriesList) {
        return <></>;
    }

    const displayCategoriesOptions = (list, values, setFieldValue) => {
        if (!list || list?.length === 0) {
            return <></>;
        }

        return (
            <TreeItem
                key={list.id}
                nodeId={list?.id?.toString()}
                label={
                    <Box component="span">
                        <Radio
                            checked={values?.parent === list.id}
                            onClick={(e) => {
                                e.stopPropagation();
                                setFieldValue('parent', values?.parent === list.id ? '' : list.id);
                            }}
                        />
                        {list?.name}
                    </Box>
                }
            >
                {Array.isArray(list?.children) &&
                    list?.children?.map((item) =>
                        displayCategoriesOptions(item, values, setFieldValue)
                    )}
            </TreeItem>
        );
    };

    return (
        <Formik
            initialValues={{
                name: initialValues?.name || '',
                active: initialValues?.active || false,
                parent: initialValues?.parent?.id || '',
            }}
            validationSchema={categorySchema}
            onSubmit={async (values, { setSubmitting }) => {
                handleSubmit(values);
                setSubmitting(false);
            }}
        >
            {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                setFieldValue,
                isSubmitting,
            }) => (
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{ margin: 5, display: 'flex', flexDirection: 'column' }}
                >
                    <Typography component="h1" variant={'h5'}>
                        {initialValues ? 'Modification' : 'Création'} d'une catégorie
                    </Typography>
                    <CmtFormBlock title="Informations générales">
                        <CmtTextField
                            value={values.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label="Nom"
                            name="name"
                            error={touched.name && errors.name}
                        />

                        <Typography variant="body1" sx={{ mt: 2 }}>
                            Catégorie parente
                        </Typography>
                        <TreeView
                            size="small"
                            id="categoriesParent"
                            value={values.parent}
                            label="Catégorie parent"
                            defaultCollapseIcon={<ExpandMoreIcon />}
                            defaultExpanded={[categoriesList.id?.toString()]}
                            defaultExpandIcon={<ChevronRightIcon />}
                            sx={{ flexGrow: 1, overflowY: 'auto' }}
                            selected={values?.parent?.toString()}
                        >
                            {displayCategoriesOptions(categoriesList, values, setFieldValue)}
                        </TreeView>
                        <Typography sx={{ fontSize: 12 }} color="error">
                            {touched?.parent && errors?.parent}
                        </Typography>
                    </CmtFormBlock>

                    <Box display="flex" justifyContent={'flex-end'}>
                        <FormControlLabel
                            sx={{ marginRight: 2, marginTop: 1 }}
                            control={
                                <Switch
                                    checked={values.active}
                                    onChange={(e) => {
                                        setFieldValue('active', e.target.checked);
                                    }}
                                />
                            }
                            label={'Activé ?'}
                            labelPlacement="start"
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={isSubmitting}
                        >
                            {initialValues ? 'Modifier' : 'Créer'}
                        </Button>
                    </Box>
                </Box>
            )}
        </Formik>
    );
};
