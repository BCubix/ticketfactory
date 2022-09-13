import React, { useRef, useEffect } from 'react';
import mapboxgl from '!mapbox-gl';
import MapboxGeocoder from '!mapbox-gl-geocoder';
import { Button, Grid, InputLabel, Typography } from '@mui/material';
import 'mapbox-gl/dist/mapbox-gl.css';
import 'mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { Box } from '@mui/system';
import { CmtTextField } from '../../../../Components/CmtTextField/CmtTextField';

const FormComponent = ({
    values,
    handleChange,
    setFieldValue,
    handleBlur,
    name,
    errors,
    field,
    label,
    touched,
}) => {
    const mapContainer = useRef(null);
    const map = useRef(null);

    useEffect(() => {
        if (map.current) {
            return;
        }

        mapboxgl.accessToken = field?.parameters?.token;

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: field.parameters?.style,
            center: [values[field.name].lng, values[field.name].lat],
            zoom: values[field.name].zoom,
        });

        const control = new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            mapboxgl: mapboxgl,
            marker: true,
            placeholder: 'Rechercher une adresse',
        });

        map.current.addControl(control, 'top-left');

        control.setInput(values[field.name].address || '');

        control.on('result', function (e) {
            setFieldValue(`${name}.address`, e.result.place_name);
        });
    }, []);

    return (
        <>
            <InputLabel id={`tagLink-${label}-label`} size="small">
                {label}
            </InputLabel>
            <Box ref={mapContainer} sx={{ height: 500, marginTop: 4 }} />

            <Grid container spacing={4} sx={{ marginTop: 5 }}>
                <Grid item xs={12} sm={6} md={4} lg={2}>
                    <CmtTextField
                        value={values[field.name].zoom}
                        label={'Zoom de la carte'}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        name={`${name}.zoom`}
                        error={
                            touched &&
                            touched[field.name] &&
                            touched[field.name].zoom &&
                            errors &&
                            errors[field.name] &&
                            errors[field.name].zoom
                        }
                        required={field?.options?.required}
                        disabled={field?.options?.disabled}
                        type="number"
                        size="small"
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={4}>
                    <CmtTextField
                        value={values[field.name].lng}
                        label={'Longitude'}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        name={`${name}.lng`}
                        error={
                            touched &&
                            touched[field.name] &&
                            touched[field.name].lng &&
                            errors &&
                            errors[field.name] &&
                            errors[field.name].lng
                        }
                        required={field?.options?.required}
                        disabled={field?.options?.disabled}
                        type="number"
                        size="small"
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={4}>
                    <CmtTextField
                        value={values[field.name].lat}
                        label={'Latitude'}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        name={`${name}.lat`}
                        error={
                            touched &&
                            touched[field.name] &&
                            touched[field.name].lat &&
                            errors &&
                            errors[field.name] &&
                            errors[field.name].lat
                        }
                        required={field?.options?.required}
                        disabled={field?.options?.disabled}
                        size="small"
                        type="number"
                    />
                </Grid>

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={2}
                    display="flex"
                    alignItems={'flex-end'}
                    paddingBottom={'10px'}
                >
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            map.current.flyTo({
                                center: [values[field.name].lng, values[field.name].lat],
                                zoom: values[field.name].zoom,
                            });
                        }}
                        fullWidth
                    >
                        Actualiser la carte
                    </Button>
                </Grid>
            </Grid>

            {field.instructions && (
                <Typography component="p" variant="body2" sx={{ fontSize: 10 }}>
                    {field.instructions}
                </Typography>
            )}
        </>
    );
};

const getInitialValue = () => {
    return { lng: 2.21, lat: 46.22, zoom: 5, address: '' };
};

export default {
    FormComponent,
    getInitialValue,
};
