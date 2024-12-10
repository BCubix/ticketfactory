import React from 'react';
import { saveVersion } from '../../services/versionService';

const RestoreButton = ({ entityId, version }) => {
    const handleRestore = () => {
        saveVersion(entityId, version.fields).then(() => alert('Version restaurée avec succès !'));
    };

    return (
        <button onClick={handleRestore} className="restore-button">
            Restaurer cette version
        </button>
    );
};

export default RestoreButton;
