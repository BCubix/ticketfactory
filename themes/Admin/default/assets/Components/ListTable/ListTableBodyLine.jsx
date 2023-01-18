import React from 'react';

import { emphasize, TableCell, TableRow } from '@mui/material';
import { ListTableCellButtons } from './ListTableCellButtons';
import { RenderCellFunction } from './RenderCellFunction';

export const ListTableBodyLine = ({
    item,
    onClick,
    table,
    onDelete,
    onEdit,
    onRemove,
    onSelect,
    onActive,
    onDisable,
    disableDeleteFunction,
    contextualMenu,
    themeId,
    handleClick,
    expendElementTranslation,
    setExpendElementTranslation,
    isTranslated = false,
}) => {
    return (
        <>
            <TableRow
                id={`tableElement-${item.id}`}
                onClick={() => {
                    if (onClick) {
                        onClick(item?.id);
                    }
                }}
                sx={{ cursor: onClick && 'pointer', backgroundColor: isTranslated && '#E1E1E1' }}
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
                    expendElementTranslation={expendElementTranslation}
                    setExpendElementTranslation={setExpendElementTranslation}
                />
            </TableRow>

            {item?.translatedElements?.length > 0 &&
                expendElementTranslation?.id === item?.id &&
                item?.translatedElements?.map((it, ind) => (
                    <ListTableBodyLine
                        item={it}
                        key={ind}
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
                        isTranslated
                    />
                ))}
        </>
    );
};
