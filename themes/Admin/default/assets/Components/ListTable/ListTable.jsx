import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Table, TableContainer } from '@mui/material';

import { getAvailableLanguages } from '@Services/utils/translationUtils';
import { languagesSelector } from '@Redux/languages/languagesSlice';
import { Component } from '@/AdminService/Component';

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
    onDragEnd = null,
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

        return getAvailableLanguages(list, languagesData);
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
                <Component.ListTableHead
                    table={table}
                    filters={filters}
                    changeFilters={changeFilters}
                    displayAction={Boolean(
                        onDelete !== null || onEdit !== null || (onRemove !== null && onSelect !== null) || (onActive !== null && onDisable !== null) || onPreview
                    )}
                    onDragEnd={onDragEnd}
                />
                <Component.CmtDragAndDropTableBody droppableId={'drag'} onDragEnd={onDragEnd}>
                    {list?.map((item, index) => (
                        <Component.ListTableBodyLine
                            item={item}
                            index={index}
                            key={index}
                            table={table}
                            onClick={onClick}
                            onDelete={onDelete}
                            onEdit={onEdit}
                            onRemove={onRemove}
                            onSelect={onSelect}
                            onActive={onActive}
                            onDisable={onDisable}
                            onPreview={onPreview}
                            onDragEnd={onDragEnd}
                            disableDeleteFunction={disableDeleteFunction}
                            contextualMenu={contextualMenu}
                            themeId={themeId}
                            handleClick={handleClick}
                            expendElementTranslation={expendElementTranslation}
                            setExpendElementTranslation={setExpendElementTranslation}
                        />
                    ))}

                    <Component.ListTableContextualMenu
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

                    <Component.CmtTranslateDialog
                        item={translateItem}
                        isOpen={Boolean(translateItem)}
                        onClose={() => setTranslateItem(null)}
                        languageList={languageList}
                        onTranslate={onTranslate}
                    />
                </Component.CmtDragAndDropTableBody>
            </Table>
        </TableContainer>
    );
};
