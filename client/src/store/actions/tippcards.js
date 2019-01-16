import {GET_TIPPCARDS} from "./types";


export function getTippcards() {
    return function (dispatch) {
        fetch('/tippcards')
            .then(res=> res.json())
            .then(tippcards => dispatch({
                type: GET_TIPPCARDS,
                payload: tippcards
            }));
    }
}