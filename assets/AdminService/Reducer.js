import store from "@Redux/store/store";

/**
 * Reducer's setter.
 *
 * @param  {string}  name
 * @param  {?}       reducer
 */
export function setReducer(name, reducer) {
    store.injectReducer(name, reducer);
}