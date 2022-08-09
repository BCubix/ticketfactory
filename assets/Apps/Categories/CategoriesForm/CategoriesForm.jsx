import {
    Button,
    FormControl,
    FormControlLabel,
    InputLabel,
    ListItemText,
    MenuItem,
    Select,
    Switch,
    Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { Formik } from 'formik';
import React from 'react';
import * as Yup from 'yup';
import { CmtFormBlock } from '../../../Components/CmtFormBlock/CmtFormBlock';
import { CmtTextField } from '../../../Components/CmtTextField/CmtTextField';

export const CategoriesForm = ({ handleSubmit, initialValues = null, categoriesList = null }) => {
    const categorySchema = Yup.object().shape({
        name: Yup.string().required('Veuillez renseigner le nom de la categorie.'),
    });

    if (!categoriesList) {
        return <></>;
    }

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

                        <FormControl fullWidth sx={{ mt: 2 }}>
                            <InputLabel id="categoriesParentLabel" size="small">
                                Catégorie parent
                            </InputLabel>
                            <Select
                                labelId="categoriesParentLabel"
                                size="small"
                                id="categoriesParent"
                                value={values.parent}
                                label="Catégorie parent"
                                onChange={(e) => {
                                    setFieldValue('parent', e.target.value);
                                }}
                            >
                                {categoriesList.map((item, index) => (
                                    <MenuItem value={item.id} key={index}>
                                        <ListItemText>{item.name}</ListItemText>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
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
