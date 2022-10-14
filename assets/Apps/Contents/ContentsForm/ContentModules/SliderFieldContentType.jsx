import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    Grid,
    IconButton,
    InputLabel,
    Slide,
    Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';
import { REDIRECTION_TIME } from '../../../../Constant';
import { loginFailure } from '../../../../redux/profile/profileSlice';
import authApi from '../../../../services/api/authApi';
import mediasApi from '../../../../services/api/mediasApi';
import { DisplayMediaType } from '../../../Medias/Components/DisplayMediaType';
import { MediaElement } from '../../../Medias/Components/sc.MediaElement';
import CloseIcon from '@mui/icons-material/Close';
import moment from 'moment/moment';

const VALIDATION_TYPE = 'mixed';
const VALIDATION_LIST = [
    {
        name: 'required',
        validationName: 'required',
        test: (value) => Boolean(value),
        params: ({ name }) => [`Veuillez renseigner le champ ${name}`],
    },

    {
        name: 'min',
        validationName: 'min',
        test: (value) => Boolean(value),
        params: ({ name, value }) => [
            value,
            `Le champ ${name} doit avoir au moins ${value} élément${value > 1 ? 's' : ''}`,
        ],
    },

    {
        name: 'max',
        validationName: 'max',
        test: (value) => Boolean(value),
        params: ({ name, value }) => [
            value,
            `Le champ ${name} doit avoir au maximum ${value} élément${value > 1 ? 's' : ''}`,
        ],
    },
];

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const FormComponent = ({ values, setFieldValue, name, field, label }) => {
    const dispatch = useDispatch();
    const [list, setList] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState(null);

    const getMedias = async () => {
        const check = await authApi.checkIsAuth();

        if (!check.result) {
            dispatch(loginFailure({ error: check.error }));

            return;
        }

        const result = await mediasApi.getMedias();

        if (!result?.result) {
            NotificationManager.error(
                'Une erreur est survenue, essayez de rafraichir la page.',
                'Erreur',
                REDIRECTION_TIME
            );
        }

        setList(result.medias);
    };

    useEffect(() => {
        getMedias();
    }, []);

    return (
        <>
            <InputLabel id={`${label}-label`}>{label}</InputLabel>
            <Button variant="contained" size="small" onClick={() => setOpenModal(true)}>
                Ajouter des images
            </Button>
            <Dialog
                open={openModal}
                onClose={() => setOpenModal(false)}
                fullScreen
                TransitionComponent={Transition}
            >
                <DialogTitle sx={{ borderBottom: '1px solid #d3d3d3' }}>
                    <Box display={'flex'} justifyContent="space-between">
                        <Typography component="h1" variant="h5" fontSize={20}>
                            Ajouter des images au slider
                        </Typography>

                        <IconButton
                            aria-label="close"
                            onClick={() => setOpenModal(false)}
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: 8,
                                color: (theme) => theme.palette.grey[500],
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <Box height="100%" width={'100%'} sx={{ padding: 0 }}>
                    <Grid container sx={{ height: '100%' }}>
                        <Grid item xs={12} md={9}>
                            <Box display="flex" px={5} py={10} flexWrap="wrap">
                                {list?.map((item, index) => (
                                    <MediaElement
                                        key={index}
                                        onClick={() => setSelectedMedia(item)}
                                        sx={{
                                            border: values[field.name].includes(item.id)
                                                ? '1px solid #FF0000'
                                                : '0px',
                                        }}
                                    >
                                        <DisplayMediaType media={item} width={'100%'} />
                                    </MediaElement>
                                ))}
                            </Box>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            md={3}
                            sx={{ borderLeft: '1px solid #d3d3d3', height: '100%' }}
                        >
                            <DisplayMediaInformation
                                onClose={() => setSelectedMedia(null)}
                                selectedMedia={selectedMedia}
                                values={values}
                                field={field}
                                setFieldValue={setFieldValue}
                                name={name}
                            />
                        </Grid>
                    </Grid>
                </Box>
            </Dialog>
            {field.helper && (
                <Typography component="p" variant="body2" sx={{ fontSize: 10 }}>
                    {field.helper}
                </Typography>
            )}
        </>
    );
};

const DisplayMediaInformation = ({
    onClose,
    selectedMedia,
    values,
    field,
    setFieldValue,
    name,
}) => {
    const isSelected = values[field.name]?.includes(selectedMedia?.id);

    if (!selectedMedia) {
        return (
            <Box mt={4} display="flex" justifyContent="center">
                <Typography variant="body1">
                    Selectionnez un élément pour afficher ses détails
                </Typography>
            </Box>
        );
    }

    return (
        <Box position="relative" px={10}>
            <IconButton
                aria-label="close"
                onClick={onClose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <CloseIcon />
            </IconButton>

            <Box sx={{ paddingTop: 10 }}>
                <Box>
                    <Typography component="span" variant="body2">
                        Crée le :
                    </Typography>
                    <Typography component="span" variant="body1" sx={{ marginLeft: 3 }}>
                        {moment(selectedMedia?.createdAt).format('DD-MM-YYYY')}
                    </Typography>
                </Box>

                {selectedMedia?.updatedAt && (
                    <Box>
                        <Typography component="span" variant="body2">
                            Mis à jour le :
                        </Typography>
                        <Typography component="span" variant="body1" sx={{ marginLeft: 3 }}>
                            {moment(selectedMedia?.updatedAt).format('DD-MM-YYYY')}
                        </Typography>
                    </Box>
                )}

                <Box>
                    <Typography component="span" variant="body2">
                        Type de fichier :
                    </Typography>
                    <Typography component="span" variant="body1" sx={{ marginLeft: 3 }}>
                        {selectedMedia?.documentType}
                    </Typography>
                </Box>

                <Box>
                    <Typography component="span" variant="body2">
                        Nom du fichier :
                    </Typography>
                    <Typography component="span" variant="body1" sx={{ marginLeft: 3 }}>
                        {selectedMedia?.documentFileName}
                    </Typography>
                </Box>

                <Box>
                    <Typography component="span" variant="body2">
                        Titre :
                    </Typography>
                    <Typography component="span" variant="body1" sx={{ marginLeft: 3 }}>
                        {selectedMedia?.title}
                    </Typography>
                </Box>
            </Box>

            <Box my={10} display="flex" justifyContent={'center'}>
                <Box maxWidth={'100%'} maxHeight={'300px'} display="flex" justifyContent="center">
                    <DisplayMediaType media={selectedMedia} maxWidth={'100%'} maxHeight={'300px'} />
                </Box>
            </Box>

            {selectedMedia?.description && (
                <Box>
                    <Typography variant="body2">Description :</Typography>
                    <Typography variant="body1" sx={{ marginLeft: 3 }}>
                        {selectedMedia?.description}
                    </Typography>
                </Box>
            )}

            {selectedMedia?.legend && (
                <Box>
                    <Typography variant="body2">Légende :</Typography>
                    <Typography variant="body1" sx={{ marginLeft: 3 }}>
                        {selectedMedia?.legend}
                    </Typography>
                </Box>
            )}

            <Button
                variant={isSelected ? 'outlined' : 'contained'}
                color={isSelected ? 'error' : 'primary'}
                onClick={() => {
                    const value = values[field.name];

                    let newValue = value;

                    if (newValue.includes(selectedMedia?.id)) {
                        newValue = newValue.filter((el) => el !== selectedMedia?.id);
                    } else {
                        newValue.push(selectedMedia?.id);
                    }

                    setFieldValue(name, newValue);
                }}
            >
                {isSelected ? 'Retirer' : 'Ajouter'} le fichier
            </Button>
        </Box>
    );
};

const getInitialValue = () => {
    return [];
};

export default {
    FormComponent,
    getInitialValue,
    VALIDATION_TYPE,
    VALIDATION_LIST,
};
