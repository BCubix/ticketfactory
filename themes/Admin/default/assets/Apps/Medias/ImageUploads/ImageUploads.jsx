import React from 'react';
export const ImageUploads = ({ imageUploads, onSelect }) => {
    return (
        <div style={{ width: '100%', borderRight: '1px solid gray' }}>
            <ul style={{ display: 'flex', listStyleType: 'none', padding: 0 }}>
                {imageUploads.map((image) => (
                    <li key={image.id} onClick={() => onSelect(image.id)} style={{ margin: 1 }}>
                        <img src={image.documentUrl} alt={`Image-${image.id}`} style={{ width: 'auto', height: 'auto', maxHeight: '60px', maxWidth: '100%' }} />
                    </li>
                ))}
            </ul>
        </div>
    );
};
