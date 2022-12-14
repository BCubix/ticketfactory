import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { apiMiddleware } from '../../../services/utils/apiMiddleware';
import { Api } from '@/AdminService/Api';

export const ImportPageBlock = () => {
    const dispatch = useDispatch();
    const [pageBlocks, setPageBlocks] = useState(null);

    useEffect(() => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.pageBlocks.getAllPageBlocks();
        });
    }, []);

    return <Box></Box>;
};
