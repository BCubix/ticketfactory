import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { Table, TableBody, TableContainer } from '@mui/material';

import { languagesSelector } from '@Redux/languages/languagesSlice';

import { ListTableHead } from './ListTableHead';
import { ListTableContextualMenu } from './ListTableContextualMenu';
import { ListTableBodyLine } from './ListTableBodyLine';
import { ListTableTranslateDialog } from './ListTableTranslateDialog';

/**
 *
 * @param {table}
 * [
 *  {
 *      name: variable name,
 *      label: header column name
 *  }
 * ]
 *
 * @param {list}
 * [
 *  {
 *      variable: value,
 *  }
 * ]
 *
 * @returns
 */
export const ListTable = ({
    table,
    list,
    filters,
    onActive = null,
    onDelete = null,
    onTranslate = null,
    onDisable = null,
    onEdit = null,
    onClick = null,
    onDuplicate = null,
    onPreview = null,
    onRemove = null,
    onSelect = null,
    themeId = null,
    changeFilters = null,
    contextualMenu = false,
    disableDeleteFunction = null,
}) => {
    const languagesData = useSelector(languagesSelector);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedMenuItem, setSelectedMenuItem] = useState(null);
    const [translateItem, setTranslateItem] = useState(false);
    const [expendElementTranslation, setExpendElementTranslation] = useState(null);

    const handleClick = (event, selectedMenu) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setSelectedMenuItem(selectedMenu);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setSelectedMenuItem(null);
    };

    const languageList = useMemo(() => {
        const list = translateItem || selectedMenuItem;

        if (!list || !list?.lang) {
            return [];
        }

        let listId = [];
        listId.push(list?.lang?.id);

        list?.translatedElements?.forEach((el) => listId.push(el.lang.id));

        return languagesData?.languages?.filter((el) => !listId.includes(el.id));
    }, [translateItem, selectedMenuItem, languagesData?.languages]);

    const defaultLanguage = useMemo(() => {
        if (!languagesData?.languages) {
            return null;
        }

        return languagesData?.languages?.find((el) => el.isDefault);
    }, [languagesData?.languages]);

    if (!table || table?.length === 0 || !list || list.length === 0) {
        return <></>;
    }

    return (
        <TableContainer>
            <Table sx={{ minWidth: 650, marginTop: 5, transition: '.3s' }}>
                <ListTableHead
                    table={table}
                    filters={filters}
                    changeFilters={changeFilters}
                    displayAction={Boolean(onDelete !== null || onEdit !== null || (onRemove !== null && onSelect !== null) || (onActive !== null && onDisable !== null))}
                />
                <TableBody>
                    {list?.map((item, index) => (
                        <ListTableBodyLine
                            item={item}
                            key={index}
                            table={table}
                            onClick={onClick}
                            onDelete={onDelete}
                            onEdit={onEdit}
                            onRemove={onRemove}
                            onSelect={onSelect}
                            onActive={onActive}
                            onDisable={onDisable}
                            disableDeleteFunction={disableDeleteFunction}
                            contextualMenu={contextualMenu}
                            themeId={themeId}
                            handleClick={handleClick}
                            expendElementTranslation={expendElementTranslation}
                            setExpendElementTranslation={setExpendElementTranslation}
                        />
                    ))}

                    <ListTableContextualMenu
                        contextualMenu={contextualMenu}
                        anchorEl={anchorEl}
                        setAnchorEl={setAnchorEl}
                        handleClose={handleClose}
                        onDelete={onDelete}
                        selectedMenuItem={selectedMenuItem}
                        setSelectedMenuItem={setSelectedMenuItem}
                        onTranslate={defaultLanguage?.id === selectedMenuItem?.lang?.id ? onTranslate : null}
                        languageList={languageList}
                        setTranslateItem={setTranslateItem}
                        onDuplicate={onDuplicate}
                        onPreview={onPreview}
                    />

                    <ListTableTranslateDialog translateItem={translateItem} setTranslateItem={setTranslateItem} languageList={languageList} onTranslate={onTranslate} />
                </TableBody>
            </Table>
        </TableContainer>
    );
};
