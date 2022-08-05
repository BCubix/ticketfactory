import {
    Button,
    Card,
    CardContent,
    Container,
    Fab,
    FormControlLabel,
    Switch,
    TextField,
    Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { FieldArray, Formik } from 'formik';
import React from 'react';
import * as Yup from 'yup';
import DeleteIcon from '@mui/icons-material/Delete';
import PostAddIcon from '@mui/icons-material/PostAdd';

export const RoomsForm = ({ handleSubmit, initialValues = null }) => {
    const roomsSchema = Yup.object().shape({
        name: Yup.string().required('Veuillez renseigner le nom de la salle.'),
    });

    return (
        <Formik
            initialValues={{
                name: initialValues?.name || '',
                active: initialValues?.active || false,
                seatsNb: initialValues?.seatsNb || '',
                area: initialValues?.area || '',
                seatingPlans: initialValues?.seatingPlans || [],
            }}
            validationSchema={roomsSchema}
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
                <Container maxWidth="sm">
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{ margin: 5, display: 'flex', flexDirection: 'column' }}
                    >
                        <TextField
                            margin="normal"
                            size="small"
                            value={values.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                            fullWidth
                            id="name"
                            label="Nom"
                            name="name"
                            autoComplete="name"
                            error={touched.name && Boolean(errors.name)}
                            helperText={touched.name && errors.name}
                        />

                        <TextField
                            margin="normal"
                            size="small"
                            value={values.seatsNb}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                            fullWidth
                            id="seatsNb"
                            label="Nombre de places"
                            name="seatsNb"
                            error={touched.seatsNb && Boolean(errors.seatsNb)}
                            helperText={touched.seatsNb && errors.seatsNb}
                        />

                        <TextField
                            margin="normal"
                            size="small"
                            value={values.area}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                            fullWidth
                            id="area"
                            label="Superficie"
                            name="area"
                            error={touched.area && Boolean(errors.area)}
                            helperText={touched.area && errors.area}
                        />

                        {console.log(values.seatingPlans)}
                        <FieldArray name="seatingPlans">
                            {({ remove, push }) => (
                                <Box>
                                    {values.seatingPlans?.map((item, index) => (
                                        <Card sx={{ marginBlock: 2 }} key={index}>
                                            <CardContent sx={{ display: 'flex' }}>
                                                <TextField
                                                    margin="normal"
                                                    size="small"
                                                    value={item.name}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    required
                                                    fullWidth
                                                    id={`seatingPlans.${index}.name`}
                                                    label="Nom"
                                                    name={`seatingPlans.${index}.name`}
                                                    error={
                                                        touched.seatingPlans &&
                                                        touched.seatingPlans[index].name &&
                                                        errors.seatingPlans &&
                                                        Boolean(errors.seatingPlans[index].name)
                                                    }
                                                    helperText={
                                                        touched.seatingPlans &&
                                                        touched.seatingPlans[index].name &&
                                                        errors.seatingPlans &&
                                                        errors.seatingPlans[index].name
                                                    }
                                                    sx={{ marginInline: 1 }}
                                                />
                                                <Fab
                                                    sx={{ marginLeft: 2, flexShrink: 0 }}
                                                    pt="2px"
                                                    className="pointer"
                                                    size="small"
                                                    onClick={() => {
                                                        remove(index);
                                                    }}
                                                >
                                                    <DeleteIcon color="error" />
                                                </Fab>
                                            </CardContent>
                                        </Card>
                                    ))}
                                    <Box pt={2} pl={4}>
                                        <Button
                                            size="small"
                                            color="primary"
                                            onClick={() => {
                                                push({ name: '', annotation: '', price: 0 });
                                            }}
                                        >
                                            <PostAddIcon />
                                            <Typography mt={1} component="p" variant="body1">
                                                Ajouter un plan de salle
                                            </Typography>
                                        </Button>
                                    </Box>
                                </Box>
                            )}
                        </FieldArray>

                        <FormControlLabel
                            sx={{ marginLeft: 'auto' }}
                            control={
                                <Switch
                                    checked={Boolean(values.active)}
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
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={isSubmitting}
                        >
                            {initialValues ? 'Modifier' : 'Créer'}
                        </Button>
                    </Box>
                </Container>
            )}
        </Formik>
    );
};
