import {
    Button,
    Card,
    CardContent,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    InputLabel,
    ListItemText,
    MenuItem,
    Select,
    Switch,
    TextField,
    Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { Formik } from 'formik';
import React from 'react';
import LightEditor from '../../../Components/Editors/LightEditor/LightEditor';
import { LightEditorFormControl } from '../../../Components/Editors/LightEditor/sc.LightEditorFormControl';
import { PageWrapper } from '../../../Components/Page/PageWrapper/sc.PageWrapper';
import { EventsDateForm } from './EventsDateForm';
import { EventsPriceForm } from './EventsPriceForm';
import * as Yup from 'yup';

export const EventsForm = ({
    handleSubmit,
    initialValues = null,
    categoriesList,
    roomsList,
    seasonsList,
}) => {
    if (!categoriesList || !roomsList || !seasonsList) {
        return <></>;
    }

    const eventSchema = Yup.object().shape({
        name: Yup.string().required("Veuillez renseigner le nom de l'évènement."),
        description: Yup.string().required('Veuillez renseigner une description.'),
    });

    return (
        <Formik
            initialValues={
                initialValues
                    ? initialValues
                    : {
                          active: true,
                          name: '',
                          description: '',
                          eventDates: [],
                          eventPrices: [],
                          eventCategory: '',
                          room: '',
                          season: '',
                      }
            }
            validationSchema={eventSchema}
            onSubmit={(values, { setSubmitting }) => {
                console.log(values);
                handleSubmit(values);

                setSubmitting(false);
            }}
        >
            {({
                values,
                errors,
                touched,
                handleChange,
                setFieldTouched,
                setFieldValue,
                handleBlur,
                handleSubmit,
                isSubmitting,
            }) => (
                <PageWrapper component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" component="h2">
                                        Informations générale
                                    </Typography>

                                    <Box mt={3}>
                                        <TextField
                                            margin="normal"
                                            size="small"
                                            value={values.name}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            fullWidth
                                            id="name"
                                            label="Nom"
                                            name="name"
                                            autoComplete="name"
                                            error={touched.name && Boolean(errors.name)}
                                            helperText={touched.name && errors.name}
                                            sx={{ marginBottom: 3 }}
                                        />

                                        <InputLabel id="description">Description</InputLabel>
                                        <LightEditorFormControl>
                                            <LightEditor
                                                labelId="description"
                                                value={values.description}
                                                onBlur={() =>
                                                    setFieldTouched('description', true, false)
                                                }
                                                onChange={(val) => {
                                                    setFieldValue('description', val);
                                                }}
                                            />
                                            <FormHelperText error>
                                                {touched.description && errors.description}
                                            </FormHelperText>
                                        </LightEditorFormControl>

                                        <FormControl fullWidth sx={{ marginTop: 3 }}>
                                            <InputLabel id="eventRoomLabel">Salle</InputLabel>
                                            <Select
                                                labelId="eventRoomLabel"
                                                id="room"
                                                value={values.room}
                                                label="Salle"
                                                onChange={(e) => {
                                                    setFieldValue('room', e.target.value);
                                                }}
                                            >
                                                {roomsList.map((item, index) => (
                                                    <MenuItem value={item.id} key={index}>
                                                        <ListItemText>{item.name}</ListItemText>
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>

                                        <FormControl fullWidth sx={{ marginTop: 3 }}>
                                            <InputLabel id="eventRoomLabel">Saison</InputLabel>
                                            <Select
                                                labelId="eventSeasonLabel"
                                                id="season"
                                                value={values.season}
                                                label="Saison"
                                                onChange={(e) => {
                                                    setFieldValue('season', e.target.value);
                                                }}
                                            >
                                                {seasonsList.map((item, index) => (
                                                    <MenuItem value={item.id} key={index}>
                                                        <ListItemText>{item.name}</ListItemText>
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>

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
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" component="h2">
                                        Dates
                                    </Typography>
                                    <EventsDateForm
                                        values={values}
                                        setFieldValue={setFieldValue}
                                        setFieldTouched={setFieldTouched}
                                        touched={touched}
                                        errors={errors}
                                        handleBlur={handleBlur}
                                        handleChange={handleChange}
                                    ></EventsDateForm>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" component="h2">
                                        Prix
                                    </Typography>
                                    <EventsPriceForm
                                        values={values}
                                        setFieldValue={setFieldValue}
                                        setFieldTouched={setFieldTouched}
                                        touched={touched}
                                        errors={errors}
                                        handleBlur={handleBlur}
                                        handleChange={handleChange}
                                    ></EventsPriceForm>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" component="h2">
                                        Catégorie
                                    </Typography>
                                    <FormControl fullWidth sx={{ marginTop: 3 }}>
                                        <InputLabel id="eventCategoryLabel">Catégorie</InputLabel>
                                        <Select
                                            labelId="eventCategoryLabel"
                                            id="eventCategory"
                                            value={values.eventCategory}
                                            label="Catégorie"
                                            onChange={(e) => {
                                                setFieldValue('eventCategory', e.target.value);
                                            }}
                                        >
                                            {categoriesList.map((item, index) => (
                                                <MenuItem value={item.id} key={index}>
                                                    <ListItemText>{item.name}</ListItemText>
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={isSubmitting}
                    >
                        {initialValues ? 'Modifier' : 'Créer'}
                    </Button>
                </PageWrapper>
            )}
        </Formik>
    );
};
