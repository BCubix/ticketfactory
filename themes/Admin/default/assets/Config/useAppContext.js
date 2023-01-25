import React from 'react';
import { AppContext } from './AppProvider';

const useAppContext = () => {
    return React.useContext(AppContext);
};

export default useAppContext;
