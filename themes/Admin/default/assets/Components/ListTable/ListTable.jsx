import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';

import { languagesSelector } from '@Redux/languages/languagesSlice';

import { ListTableHead } from './ListTableHead';
import { ListTableCellButtons } from './ListTableCellButtons';
import { ListTableContextualMenu } from './ListTableContextualMenu';
import { ListTableTranslateDialog } from './ListTableTranslateDialog';
import { RenderCellFunction } from './RenderCellFunction';

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

    const handleClick = (event, selectedMenu) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setSelectedMenuItem(selectedMenu);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setSelectedMenuItem(null);
    };

    if (!table || table?.length === 0 || !list || list.length === 0) {
        return <></>;
    }

    return (
        <TableContainer>
            <Table sx={{ minWidth: 650, marginTop: 5 }}>
                <ListTableHead
                    table={table}
                    filters={filters}
                    changeFilters={changeFilters}
                    displayAction={Boolean(onDelete !== null || onEdit !== null || (onRemove !== null && onSelect !== null) || (onActive !== null && onDisable !== null))}
                />
                <TableBody>
                    {list?.map((item, index) => (
                        <TableRow
                            key={index}
                            id={`tableElement-${item.id}`}
                            onClick={() => {
                                if (onClick) {
                                    onClick(item?.id);
                                }
                            }}
                            sx={onClick ? { cursor: 'pointer' } : {}}
                        >
                            {table.map((tableItem, ind) => (
                                <TableCell component="th" scope="row" key={ind}>
                                    <RenderCellFunction item={item} tableItem={tableItem} />
                                </TableCell>
                            ))}

                            <ListTableCellButtons
                                item={item}
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
                            />
                        </TableRow>
                    ))}

                    <ListTableContextualMenu
                        contextualMenu={contextualMenu}
                        anchorEl={anchorEl}
                        setAnchorEl={setAnchorEl}
                        handleClose={handleClose}
                        onDelete={onDelete}
                        selectedMenuItem={selectedMenuItem}
                        setSelectedMenuItem={setSelectedMenuItem}
                        onTranslate={onTranslate}
                        languagesData={languagesData}
                        setTranslateItem={setTranslateItem}
                        onDuplicate={onDuplicate}
                        onPreview={onPreview}
                    />

                    <ListTableTranslateDialog translateItem={translateItem} setTranslateItem={setTranslateItem} languagesData={languagesData} onTranslate={onTranslate} />
                </TableBody>
            </Table>
        </TableContainer>
    );
};
