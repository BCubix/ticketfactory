import React from 'react';
import { List, ListItem, ListItemText, Button, Typography, Paper } from '@mui/material';

const HistoryList = ({ versions, onSelectVersion }) => {
    if (!versions || versions.length === 0) {
        return <Typography variant="body1">Aucune version enregistrée.</Typography>;
    }

    return (
        <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>
                Historique des versions
            </Typography>
            <List>
                {versions.map((version, index) => (
                    <ListItem key={version.id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <ListItemText primary={`Version ${index + 1}`} secondary={`Date : ${new Date(version.modifiedDate).toLocaleString()}`} />
                        <Button variant="outlined" color="primary" onClick={() => onSelectVersion(version)}>
                            Voir les différences
                        </Button>
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
};

export default HistoryList;
