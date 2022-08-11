import { Card, CardContent, Dialog, Typography } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CmtPageWrapper } from '../../../Components/CmtPage/CmtPageWrapper/CmtPageWrapper';
import { getMediasAction, mediasSelector } from '../../../redux/medias/mediasSlice';

export const MediasList = () => {
    const { loading, medias, error } = useSelector(mediasSelector);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [createDialog, setCreateDialog] = useState(false);

    useEffect(() => {
        if (!loading && !rooms && !error) {
            dispatch(getMediasAction());
        }
    }, []);

    return (
        <CmtPageWrapper title="Médias">
            <Card>
                <CardContent>
                    <Typography component="h2" variant="h3">
                        Salles ({medias?.length})
                    </Typography>
                    <Button variant="contained" onClick={() => setCreateDialog(true)}>
                        Nouveau
                    </Button>
                </CardContent>
            </Card>
            <Dialog
                fullWidth
                maxWidth="md"
                open={createDialog}
                onClose={() => setCreateDialog(false)}
            ></Dialog>
        </CmtPageWrapper>
    );
};
