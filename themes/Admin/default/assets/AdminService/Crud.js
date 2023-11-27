import { checkComponent, checkString } from '@Services/utils/check';

const CrudObj = {};

/**
 * Crud's getter.
 */
export const Crud = new Proxy(CrudObj, {
    get(target, key, receiver) {
        if (!(key in target)) {
            throw new Error(`${key} must be in Crud.`);
        }

        return Reflect.get(target, key, receiver);
    },
});

/**
 * Crud's setter.
 *
 * @param  {string}          name
 * @param  {function|object} component
 *
 * @throws {Error} Parameters are not corresponded of type script.
 */
export function setCrud(name, crud) {
    checkString(name);
    checkComponent(crud);

    CrudObj[name] = crud;
}

export function addNewCrud(name, crud) {
    checkString(name);
    checkComponent(crud);

    CrudObj[name] = crud;
}

export function addCrudAction(name, action, crud) {
    checkString(name);
    checkComponent(crud);

    if (!CrudObj[name]) {
        CrudObj[name] = { [action]: crud };
        return;
    }

    CrudObj[name][action] = crud;
}

/*
- getApiFields(name, action)
- setApiFields(name, action, fields)

- getFormFields(name, action)
- setFormFields(name, action)

- getListFilters(name)
- setListFilters(name, filters)

- addCreateAction(name, crud = defaultTemplate)
- addEditAction(name, crud = defaultTemplate)
*/
