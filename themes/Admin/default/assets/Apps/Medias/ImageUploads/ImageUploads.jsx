import { Box } from '@mui/system';
import React from 'react';
export const ImageUploads = ({ imageUploads, onSelect }) => {
    return (
        <Box sx={{ width: 100, borderRight: '1px solid gray', position: 'absolute', right: '100%' }}>
            <Box component="ul" sx={{ listStyleType: 'none', padding: 0 }}>
                {imageUploads.map((image) => (
                    <Box
                        component="li"
                        sx={{ marginBottom: 3 }}
                        key={image.id}
                        onClick={() => onSelect(image.id)}
                        style={{ margin: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}
                    >
                        <Box
                            component="img"
                            src={image.documentUrl}
                            alt={`Image-${image.id}`}
                            sx={{ width: 'auto', height: 'auto', maxHeight: '60px', maxWidth: '100%', borderRadius: '3px', cursor: 'pointer' }}
                        />
                    </Box>
                ))}
            </Box>
        </Box>
    );
};
