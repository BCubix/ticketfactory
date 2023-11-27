import React from 'react';
import ExtensionIcon from '@mui/icons-material/Extension';
import { Avatar } from '@mui/material';
import { checkArray, checkObject, checkString } from '@Services/utils/check';

const keys = ['name', 'label', 'width', 'type', 'sortable', 'renderFunction'];

const TableColumnObj = {
    ModulesList: [
        {
            label: 'Logo',
            width: '7%',
            renderFunction: (item) => {
                if (item.logoUrl) {
                    try {
                        return <Avatar src={item.logoUrl} />;
                    } catch (e) {}
                }
                return (
                    <Avatar>
                        <ExtensionIcon />
                    </Avatar>
                );
            },
        },
        { name: 'displayName', label: 'Nom', width: '10%' },
        { name: 'version', label: 'Version', width: '5%' },
        { name: 'author.name', label: 'Auteur', width: '10%' },
        { name: 'description', label: 'Description', width: '58%' },
    ],
};

/**
 * TableColumn's getter.
 */
export const TableColumn = new Proxy(TableColumnObj, {
    get(target, key, receiver) {
        if (!(key in target)) {
            throw new Error(`${key} must be in TableColumn.`);
        }

        return Reflect.get(target, key, receiver);
    },
});

/**
 * TableColumn's setter.
 *
 * @param  {string}  name
 * @param  {Array}   tableColumn
 *
 * @throws {Error} Parameters are not corresponded of type script.
 */
export function setTableColumn(name, tableColumn = []) {
    checkString(name);
    checkArray(tableColumn);

    tableColumn.forEach((obj) => {
        checkObject(obj);

        Object.keys(obj).forEach((key) => {
            if (!keys.find((keyRule) => keyRule === key)) {
                throw new Error(`${key} must be in TableColumn's keys.`);
            }
        });
    });

    TableColumnObj[name] = tableColumn;
}
