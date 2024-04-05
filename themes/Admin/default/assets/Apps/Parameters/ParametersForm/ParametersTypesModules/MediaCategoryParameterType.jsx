import React, { useEffect, useMemo, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch, useSelector } from 'react-redux';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { TreeItem, TreeView } from '@mui/x-tree-view';
import { Box, Grid, InputLabel, Radio } from '@mui/material';

import { Api } from '@/AdminService/Api';
import { Constant } from '@/AdminService/Constant';
import { languagesSelector } from '@Apps/Languages/redux/languages/languagesSlice';
import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { getDefaultParentPath } from '@Services/utils/getDefaultParentPath';

const TYPE = 'MediaCategory';

function getType() {
    return TYPE;
}

const displayCategoriesOptions = (list, value, setFieldValue, name) => {
    if (!list || list?.length === 0) {
        return <></>;
    }

    return (
        <TreeItem
            key={list.id}
            nodeId={list?.id?.toString()}
            label={
                <Box component="span">
                    <Radio
                        checked={value?.toString() === list.id?.toString()}
                        onClick={(e) => {
                            e.stopPropagation();
                            setFieldValue(name, value === list.id ? '' : list.id);
                        }}
                    />
                    {list?.name}
                </Box>
            }
        >
            {Array.isArray(list?.children) && list?.children?.map((item) => displayCategoriesOptions(item, value, setFieldValue, name))}
        </TreeItem>
    );
};

const getComponent = ({ paramName, paramKey, paramValue, paramBreakpoints, setFieldValue, indexTab, indexBlock, indexParam }) => {
    const dispatch = useDispatch();
    const languagesData = useSelector(languagesSelector);
    const [list, setList] = useState(null);

    useEffect(() => {
        if (!languagesData.languages || list?.length > 0) {
            return;
        }

        const defaultLanguageId = languagesData.languages.find((el) => el.isDefault)?.id;
        if (!defaultLanguageId) {
            return;
        }

        apiMiddleware(dispatch, async () => {
            Api.mediaCategoriesApi.getMediaCategories({ lang: defaultLanguageId }).then((result) => {
                if (result.result) {
                    setList(result.mediaCategories);
                    return;
                }

                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
            });
        });
    }, [languagesData.languages]);

    const defaultExpend = useMemo(() => {
        return getDefaultParentPath(list || [], paramValue);
    }, [list]);

    if (!list) {
        return <></>;
    }

    return (
        <Grid item key={indexParam} {...paramBreakpoints} display={'flex'} flexDirection={'column'} pl={5}>
            <InputLabel id={`${paramKey}-label`} required sx={{ fontSize: '12px' }}>
                {paramName}
            </InputLabel>
            <TreeView
                size="small"
                id={paramKey}
                value={paramKey}
                label={paramName}
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpanded={[list?.id?.toString(), ...defaultExpend]}
                defaultExpandIcon={<ChevronRightIcon />}
                sx={{ flexGrow: 1, overflowY: 'auto' }}
                selected={paramValue?.toString()}
            >
                {displayCategoriesOptions(list, paramValue, setFieldValue, `tabs[${indexTab}].blocks[${indexBlock}].parameters[${indexParam}].paramValue`)}
            </TreeView>
        </Grid>
    );
};

export default {
    getType,
    getComponent,
};
