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

export function getFormFields(name, actionName) {
    checkString(name);

    return Crud[name][actionName]?.fields;
}

export function setFormFields(name, actionName, fields) {
    checkString(name);
    checkString(actionName);

    let crud = Crud[name];
    crud[actionName].fields = fields;

    setCrud(name, crud);
}

export function getForm(name, actionName) {
    checkString(name);

    return Crud[name][actionName]?.form;
}

export function setForm(name, actionName, form) {
    checkString(name);
    checkString(actionName);

    let crud = Crud[name];
    crud[actionName].form = form;

    setCrud(name, crud);
}

export function getApiFields(name, actionName) {
    checkString(name);

    return Crud[name][actionName]?.api?.dataFields;
}

export function setApiFields(name, actionName, fields) {
    checkString(name);
    checkString(actionName);

    let crud = Crud[name];
    crud[actionName].api.dataFields = fields;

    setCrud(name, crud);
}

/*
- addCreateAction(name, crud = defaultTemplate)
- addEditAction(name, crud = defaultTemplate)
*/
