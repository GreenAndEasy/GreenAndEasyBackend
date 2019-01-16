import {GET_CATEGORIES} from "./types";


export function getCategories() {
    return function (dispatch) {
        fetch('/categories')
            .then(res=> res.json())
            .then(categories => dispatch({
                type: GET_CATEGORIES,
                payload: categories
            }));
    }
}