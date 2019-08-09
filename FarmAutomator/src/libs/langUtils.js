/**
 * This lib contains functions is relating to javascript language features.
 */

import { capitalize } from './stringUtils';

export function isEmptyObject(obj) {
    return !obj || Object.keys(obj).length === 0;
}

/**
 * Map a list of fields to an object using keyProp as returned object field names.
 * @param {any} fieldList
 * @param {any} keyProp
 * @param {any} valProp
 */
export function listToObject(fieldList, keyProp, valProp) {
    var obj = {};
    fieldList.forEach(f => obj[f[keyProp]] = f[valProp]);
    return obj;
}

/**
 * Convert on object with camel case prop names into an object with capitalized prop names
 * @param {Object} obj
 * @returns {Object}
 * @example {aa: 1, bb:2} => {Aa: 1, Bb: 2}
 */
export function toCapitalizedObject(obj) {
    if (!(obj instanceof Object)) return obj;

    var obj2 = {};
    var props = Object.keys(obj);
    props.forEach(p => obj2[capitalize(p)] = obj[p]);

    return obj2;
}

/**
 * Get propperty case-insensitively
 * @param {any} obj
 * @param {any} prop
 */
export function getPropIncase(obj, prop) {

    prop = prop.toLowerCase();
    for (var p in obj) {
        if (obj.hasOwnProperty(p) && prop === (p + '').toLowerCase()) {
            return obj[p];
        }
    }
}

/**
 * Convert a property path to property list.
 * @param {string} path
 * @returns {[string|int]} list of props matching the path
 * @example 'a.0.b' => ['a', 0, 'b']
 */
export function pathToPropsList(path) {
    if (!path) return [];

    var parts = path.split('.');
    return parts.map(part => {
        var idx = parseInt(part);
        if (isNaN(idx)) return part;
        return idx;
    });
}

/**
 * Get object property following a path.
 * This is a high order function which will return a function to apply on target object.
 * Usage: const getUserComments = get(['user', 'comments', 0, 'blog', 'title'])
 *        getUserComments(props)
 * accessing user's comments
 * props.user &&
 * props.user.comments &&
 * props.user.comments[0] &&
 * props.user.comments[0].blog.title
 * @param {Array} path array of path properties, from outter to inner. Array index is allowed.
 * @returns function to apply to target object.
 */
export const get = path => obj => path.reduce((curProp, nextProp) => (curProp && curProp[nextProp]) ? curProp[nextProp] : null, obj);

var ajaxErrorHandlers = {};

export function registerAjaxErrorHandler(handlerName, handler) {
    ajaxErrorHandlers[handlerName] = handler;
}

export function unregisterAjaxErrorHandler(handlerName) {
    delete ajaxErrorHandlers[handlerName];
}

function triggerAjaxErrorHandlers(thrownError) {

    var keys = Object.keys(ajaxErrorHandlers);
    keys.forEach(key => {
        try {
            ajaxErrorHandlers[key](thrownError);
        }
        catch (err) {
            console.log(`Handler ${key} error: `, err);// eslint-disable-line no-console
        }
    });
}

export function testAjaxErrorHandler() {
    triggerAjaxErrorHandlers();
}
